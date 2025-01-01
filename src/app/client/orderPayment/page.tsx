"use client";

import useApiToast from "@/hooks/useApiToast";
import Payment from "../components/payment";
import axios from "axios";
import {
  unskippableDialogType,
  updateDialog,
} from "@/app/redux/slices/filteration.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/app/Home/components/Navbar";
import { Button } from "react-day-picker";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function Page() {
  const apiCall = useApiToast();
  const [data, setData] = useState();
  const [serviceData, setServiceData] = useState([]);
  const [customData, setCustomData] = useState([]);
  const router = useRouter();
  async function checkTheLength() {
    const url = "/api/client/payment/fetch-all-payment-orders";
    const res = await apiCall(url, null, axios.get);
    if (res.statusCode === 200 && res.success === true) {
      if (!res.data) {
        return;
      }
      console.log(res.data);

      setData(res.data);
      if (res.data.customOrders) setCustomData(res.data.customOrders);
      if (res.data.serviceOrders) {
        setServiceData(res.data.serviceOrders);
      }
    } else if (res.statusCode === 200 && res.success === false) {
      dispatch(updateDialog({ length: 0, isAllPaid: true, isOpen: false }));
      router.push("/");
    }
  }
  useEffect(() => {
    checkTheLength();
  }, []);

  const dispatch = useDispatch();
  const openParam: unskippableDialogType = useSelector(
    (state) => state.filter
  ).unskippableDialog;

  console.log(serviceData);
  console.log(customData);

  return (
    <Navbar>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-50 py-10">
        <Card className="w-full max-w-4xl shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Payment Page</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Please pay one by one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* All cards */}
            <div className="mb-5">
              <CardTitle className="text-lg font-semibold">
                Selected Services
              </CardTitle>
            </div>
            <ScrollArea className="h-[calc(100vh-300px)] mb-5">
              {serviceData?.length === 0 ? (
                <p className="text-gray-500">Nothing To Pay</p>
              ) : (
                serviceData?.map((order) => (
                  <Card key={order._id} className="mb-4 px-10 py-10 border border-chart-1">
                    <CardHeader className="flex flex-row gap-10 items-center">
                      <div>
                        <CardTitle className="text-md font-medium">
                          {order?.serviceOrderDetails?.serviceDetails?.name ||
                            "N/A"}
                        </CardTitle>
                      </div>
                      <img
                        className="h-10 w-20 object-cover rounded-md"
                        src={
                          order?.serviceOrderDetails?.serviceDetails.thumbnail ||
                          `https://via.placeholder.com/100`
                        }
                        alt="Service Thumbnail"
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                          <p>Amount:</p>
                          <p className="font-semibold">
                            {order.serviceOrderDetails?.serviceDetails.price}
                          </p>
                        </div>
                        <Payment
                          amount={
                            order.serviceOrderDetails?.serviceDetails.price
                          }
                          verificationUrl="/api/admin/payment/verify-payment"
                          requestId={order.serviceOrderDetails._id}
                          serviceName={
                            order.serviceOrderDetails?.serviceDetails.name
                          }
                          status={order.serviceOrderDetails.paymentStatus}
                          createdAt={order.createdAt}
                          orderUrl="/api/admin/payment/razorpay-create-order"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <Separator />
              <div className="mb-5">
                <CardTitle className="text-lg font-semibold">
                  Custom Orders
                </CardTitle>
              </div>
              {customData?.length === 0 ? (
                <p className="text-gray-500">Nothing To Pay</p>
              ) : (
                customData?.map((order) => (
                  <Card key={order._id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-md font-medium">
                        {order?.description || "N/A"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-row gap-10 items-center">
                        <img
                          className="h-10 w-20 object-cover rounded-md"
                          src={`https://via.placeholder.com/100`}
                          alt="Custom Order Thumbnail"
                        />
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-row gap-2">
                            <p>Amount:</p>
                            <p className="font-semibold">
                              {order?.amount || 10}
                            </p>
                          </div>
                          <Payment
                            amount={order.amount}
                            requestId={order._id}
                            serviceName={order.description}
                            status={order.paymentStatus}
                            createdAt={order.createdAt}
                            orderUrl={`/api/admin/other-services/payment/razorpay-create-order`}
                            verificationUrl="/api/admin/other-services/payment/verify-payment"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Navbar>
  );
}

export default Page;
