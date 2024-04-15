import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import express from "express";

const hummingbird = new Hummingbird();

const app = hummingbird.app;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

hummingbird.get("/", controllers.index);

hummingbird.post("/api/chat", controllers.chat);

await hummingbird.start();
