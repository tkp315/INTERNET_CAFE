import { PDFDocument, rgb } from "pdf-lib";
import { UserModel } from "@/models/User.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import DataURIParser from "datauri/parser";
import { cloudinary } from "@/lib/cloudinary";
import { ServiceRequestModel } from "@/models/ServiceRequest.Model";
import { Status } from "@/types/models.types";
import { dbConnectionInstance } from "@/lib/db";

export async function POST(req: NextRequest) {
  await dbConnectionInstance.connectToDB();
  try {
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    if (!token) {
      return NextResponse.json({
        message: "Login first",
        success: false,
        statusCode: 400,
      });
    }

    const { selectedServiceData } = await req.json();
    let formDetailURL;
    if (!selectedServiceData) {
      return NextResponse.json({
        message: "Service Data Not Found",
        success: false,
        statusCode: 404,
      });
    }
    const clientId = token._id;
    const client = await UserModel.findOne({
      $or: [{ _id: clientId }, { email: token.email }],
    });
    console.log("token details", token);
    if (!client) {
      return NextResponse.json({
        message: "Client Not Found",
        success: false,
        statusCode: 404,
      });
    }

    const clientDetails = {
      Name: client.name,
      Phone: client.phoneNo,
      Email: client.email,
    };

    const { service, processingData } = selectedServiceData;
    const { availability, clientFormDetails, selectedFunctions } =
      processingData;

    const serviceDetails = {
      ServiceId: service._id,
      ServiceName: service.serviceName,
      CategoryName: service.categoryName,
      ServicePrice: service.servicePrice,
    };

    const completionDetails = {
      StartTime: availability.startTime,
      EndTime: availability.endTime,
      Date: availability.date,
      AvailabilityId: availability._id,
    };

    const { urls, jsonData } = clientFormDetails;
    if (!urls || !Array.isArray(urls)) {
      throw new Error("Invalid or missing URLs in client form details");
    }
    if (!jsonData || !Array.isArray(jsonData)) {
      throw new Error("Invalid or missing JSON data in client form details");
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    const margins = { top: 50, bottom: 50, left: 50, right: 50 };
    let currentY = height - margins.top;

    const fontSize = {
      heading: 20,
      subHeading: 18,
      key: 14,
      text: 12,
    };

    // Helper function for dynamic text rendering with page checks
    function createText(pdfDoc, text, options) {
      const { x, fontSize, color, gap } = options;
      let page = options.page;
      if (currentY - fontSize - gap < margins.bottom) {
        // Add a new page if the current page is full
        page = pdfDoc.addPage([600, 800]);
        currentY = page.getHeight() - margins.top;
      }

      page.drawText(text, {
        x,
        y: currentY,
        size: fontSize,
        color,
      });

      currentY -= gap;
      return page; // Return the updated page object
    }

    // Render a heading (center-aligned)
    function drawHeading(page, text, size, color) {
      const textWidth = text.length * size * 0.6; // Approximation for text width
      const centerX = (width - textWidth) / 2;

      page.drawText(text, {
        x: centerX,
        y: currentY,
        size,
        color,
      });
      currentY -= 40; // Gap below the heading
    }

    // Render key-value pairs for details
    function drawKeyValueSection(page, title, details, titleColor, keyColor) {
      // Title of the section
      currentY -= 10; // Additional gap before the title
      page = createText(pdfDoc, title, {
        page,
        x: margins.left,
        fontSize: fontSize.subHeading,
        color: titleColor,
        gap: 30,
      });

      // Key-value details
      Object.entries(details).forEach(([key, value]) => {
        page = createText(pdfDoc, `${key}: ${value}`, {
          page,
          x: margins.left + 20,
          fontSize: fontSize.text,
          color: keyColor,
          gap: 20,
        });
      });

      return page;
    }

    // Draw main heading
    drawHeading(page, "Submitted Form Details", fontSize.heading, rgb(0, 0, 1));

    // Client Details Section
    page = drawKeyValueSection(
      page,
      "Client Details",
      clientDetails,
      rgb(0.1, 0.5, 0.1),
      rgb(0, 0, 0)
    );

    // Service Details Section
    page = drawKeyValueSection(
      page,
      "Service Details",
      serviceDetails,
      rgb(0.1, 0.5, 0.1),
      rgb(0, 0, 0)
    );
    // Selected Functions Section

    page = createText(pdfDoc, "Service Functions", {
      page,
      x: margins.left,
      fontSize: fontSize.subHeading,
      color: rgb(0.1, 0.5, 0.1),
      gap: 30,
    });

    for (let i = 0; i < selectedFunctions.length - 1; i++) {
      page = createText(pdfDoc, `${selectedFunctions[i]}`, {
        page,
        x: margins.left + 20,
        fontSize: fontSize.text,
        color: rgb(0, 0, 0),
        gap: 20,
      });
    }
    // Completion Details Section
    page = drawKeyValueSection(
      page,
      "Completion Details",
      completionDetails,
      rgb(0.1, 0.5, 0.1),
      rgb(0, 0, 0)
    );

    // URLs Section
    page = createText(pdfDoc, "Files", {
      page,
      x: margins.left,
      fontSize: fontSize.subHeading,
      color: rgb(0.1, 0.5, 0.1),
      gap: 30,
    });

    urls.forEach((url) => {
      page = createText(pdfDoc, `${url.name}: ${url.url}`, {
        page,
        x: margins.left + 20,
        fontSize: fontSize.text,
        color: rgb(0, 0, 0),
        gap: 20,
      });
    });

    // JSON Data Section
    page = createText(pdfDoc, "Additional Information", {
      page,
      x: margins.left,
      fontSize: fontSize.subHeading,
      color: rgb(0.1, 0.5, 0.1),
      gap: 30,
    });

    jsonData.forEach((data) => {
      page = createText(pdfDoc, `${data.key}: ${data.val}`, {
        page,
        x: margins.left + 20,
        fontSize: fontSize.text,
        color: rgb(0, 0, 0),
        gap: 20,
      });
    });

    // Save and return the PDF
    const pdfBytes = await pdfDoc.save();
    const pdfFile = pdfBytes.buffer;
    const pdfBufferFile = Buffer.from(pdfFile);
    const parser = new DataURIParser();
    const pdfDataUri = await parser.format(
      `${clientDetails.Name}-${serviceDetails.ServiceName}`,
      pdfBufferFile
    );
    if (pdfDataUri.content) {
      try {
        const pdfURL = await cloudinary.uploader.upload(pdfDataUri.content, {
          resource_type: "raw",
          folder: process.env.CLOUDINARY_FOLDER_SRC_REQ,
        });
        console.log(pdfURL);
        formDetailURL = pdfURL;
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error("Failed to generate Data URI from PDF bytes");
    }

    // DB Operation
    const functions = selectedFunctions.map((fun: string) => {
      if (typeof fun !== "object") {
        return fun;
      }
    });
    const newServiceRequest = await ServiceRequestModel.create({
      service: serviceDetails.ServiceId,
      client: client._id,
      formDetails: formDetailURL?.secure_url,
      completion: completionDetails.AvailabilityId,
      requestedFunction: functions,
      status: Status.Pending,
      description: `
     Hi,${clientDetails.Name} your request is reached to us 
     i will notify you when I will complete your assignment, Don't worry
     all the information you shared with us will be deleted within 10 mins of 
     work completion `,
    });

    client.MyRequestedServices.push(newServiceRequest._id);
    await client.save();

    return NextResponse.json({
      message: "Your Request is Successfully Submitted",
      statusCode: 200,
      data: newServiceRequest,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Something went wrong",
      statusCode: 500,

      success: false,
    });
  }
}
