"use client"
import { type EdgeStoreRouter } from './edgestore-server';
import {createEdgeStoreProvider} from '@edgestore/react'

export const {EdgeStoreProvider,useEdgeStore} = createEdgeStoreProvider<EdgeStoreRouter>();
