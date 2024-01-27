# KAIBURR - Final Assignment

## Introduction

A SPA (Single Page App) using ReactJS that visualizes large data table with the help of bar charts

## Table of Contents

1. ### Packages used
2. ### Installation and Setup
3. ### Working and Usage

## Packages used

1. mui (Material UI)
2. prop-types
3. plotly.js

## Installation and Setup

To install the project first make a new project directory and clone the project in this directory.
Run the following to commands one by one to make a new directory named `irshaduddin-final-assignment` and clone the project inside this directory.
```
mkdir irshaduddin-final-assignment
cd irshaduddin-final-assignment
git clone https://github.com/kaisar12012000/Kaiburr---UI-Assessment.git
```

Now that the project is cloned we will install all dependencies. First make sure you are on main branch. Then run the following command to install all dependencies.
```
npm i
```

Once all installations are complete, you are ready to start the server. Run the following command to start the server.
```
npm start
```

The frontend server starts on `PORT=3000`. You can access the app at [http://localhost:3000/](http://localhost:3000/).

## Working and Usage

This is a single page application where on loading a large data is requested from dummyjson.com.

dummyjson.com provides multiple REST API's from which we are using 2 API's in this project.

The first API used is a GET API for getting all products. Here a query(`limit=0`) is passed to ignore limits in the response. This API returns a response with 100 prooducts.

The response is processed and stored in state variables. First the response is processed to fetch all numeric data and store them in seperate state variables by a data processor function.

I have used Material UI's DataGrid component to render the data into a DataTable. MUI's DataGrids comes with built-in props to ease the development process.

DataGrid comes with an inbuilt sorting function, checkbox onChange handler, virtualization, pagination and much more. I used these inbuilt props to implement lazy loading of data with pagination such that the app performance is optimized and large amount of data can be rendered smoothly.

The second API used was the search API. It is a GET API where the search query is passed as a URL query parameter. Here I implemented a smart search wherein you type on letter and all relevent data is displayed in the table, the chart changes accordingly too. Here I used the AbortController to pass the signal in the request aborting old pending requests whenever a new request is invoked.

The last feature is the real time bar chart. The same data processor function that is invoked when component loads is invoked again whenever a checkbox input is changed(checked/unchecked). On every change the DataGrid component has a details array that has indices of all rows with checked checkbox. I used this details array to add or remove data from the bar chart.

### Have a look at it working

![Alt-text](https://github.com/kaisar12012000/Kaiburr---UI-Assessment.git/blob/main/demo.gif)