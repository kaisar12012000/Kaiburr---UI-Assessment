import React, { useEffect, useState } from 'react'
import { API_URLS } from '../constants/urls'
import { Box, Tab, Tabs, Typography } from "@mui/material"
import PropTypes from "prop-types"
import Plot from "react-plotly.js"
import { DataGrid } from "@mui/x-data-grid"
import "./styles/dashboard.css"

const dataPrep = (data, selectedValues = [1,2,3,4,5]) => {
    const pns = data.map(item => {
        if(selectedValues.includes(item?.id)) {
            return item?.title
        }
    })
    const ps = data.map(item => {
        if(selectedValues.includes(item?.id)) {
            return item?.price
        }
    })
    const dps = data.map(item => {
        if(selectedValues.includes(item?.id)) {
            return item?.discountPercentage
        }
    })
    const rs = data.map(item => {
        if(selectedValues.includes(item?.id)) {
            return item?.rating
        }
    })
    const ss = data.map(item => {
        if(selectedValues.includes(item?.id)) {
            return item?.stock
        }
    })
    return {
        pns, ps, dps, rs, ss
    }
    // console.log(productNames)
}

function BarChartComp (props) {
    const { xEntries, yEntries, name } = props

    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [screenWidth])

    return (
        <Box sx={{ width: "100%", height: "50%" }}>
            <Plot
              showlegend
              data={[
                {
                    x: xEntries,
                    y: yEntries,
                    type: "bar",
                    marker: {
                        color: name === "Prices" ? "#2ecc71" : name === "Discount Percentages" ? "#3498db" : name === "Ratings" ? "#FFD866" : "#8FA64C"
                    },   
                }
              ]}
              layout={
                {
                    width: screenWidth,
                    height: "100%",
                    title: name,
                    transition: {
                        duration: 500,
                        easing: "linear-in"
                    }
                }
              }
            />
        </Box>
    )

}

function CustomPanel (props) {
    const {chart, value, index} = props
    return (
        <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
              <Box sx={{ width: "100%", height: "100%", textAlign: "center" }}>
                {chart}
              </Box>
            )}
        </div>
    )
}

CustomPanel.propTypes = {
    chart: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

function HorizontalPanel (props) {

    const { productNames, prices, discountPercentage, ratings, stocks } = props

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return (
        <Box className="h-panel" sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label='disabled tabs example' centered>
                    <Tab label="Prices" {...a11yProps(0)}></Tab>
                    <Tab label="Discounts %" {...a11yProps(1)}></Tab>
                    <Tab label="Ratings" {...a11yProps(2)}></Tab>
                    <Tab label="Stocks" {...a11yProps(3)}></Tab>
                </Tabs>
            </Box>
            <CustomPanel value={value} index={0} chart={<BarChartComp yEntries={prices} xEntries={productNames} name="Prices" />}>
                Prices
            </CustomPanel>
            <CustomPanel value={value} index={1} chart={<BarChartComp yEntries={discountPercentage} xEntries={productNames} name="Discount Percentages" />}>
                Discounts %
            </CustomPanel>
            <CustomPanel value={value} index={2} chart={<BarChartComp yEntries={ratings} xEntries={productNames} name="Ratings" />}>
                Ratings
            </CustomPanel>
            <CustomPanel value={value} index={3} chart={<BarChartComp yEntries={stocks} xEntries={productNames} name="Stocks" />}>
                Stocks
            </CustomPanel>
        </Box>
    )
}

function DataTable (props) {

    const [selectedItems, setSelectedItems] = useState([])

    const {products, setProductNames, setPrices, setDiscountPercents, setRatings, setStocks} = props

    const columns = [
        {field: 'id', headerName: 'ID', width: 200},
        {field: 'title', headerName: 'Title', width: 200},
        {field: 'brand', headerName: 'Brand', width: 200},
        {field: 'category', headerName: 'Category', width: 200},
        {field: 'description', headerName: 'Description', width: 200},
        {field: 'price', headerName: 'Price', sortable: true},
        {field: 'discountPercentage', headerName: 'Discount Percentage', sortable: true, width: 200},
        {field: 'rating', headerName: 'Rating', sortable: true, width: 200},
        {field: 'stock', headerName: 'Stock', sortable: true, width: 200},
    ]

    const rows = products.map(item => {
        return {id: item?.id, title: item?.title, brand: item?.brand, category: item?.category, description: item?.description, price: item?.price, discountPercentage: item?.discountPercentage, rating: item?.rating, stock: item?.stock}
    })


    // useEffect(() => {
    //     setSelectedItems([1,2,3,4,5])
    // }, [])

    return (
        <Box sx={{  width: "100%", height: "50%", overflow: "scroll", position: "absolute"}}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10
                    }
                },
                
              }}
              pageSizeOptions={[10, 50, 100, 500, 1000]}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={(details) => {
                setSelectedItems([...details])
                const {pns, ps, dps, rs, ss} = dataPrep(products, details)
                setProductNames(pns)
                setPrices(ps)
                setDiscountPercents(dps)
                setRatings(rs)
                setStocks(ss)
              }}
              density='comfortable'
              rowSelectionModel={selectedItems.length == 0 ? [1,2,3,4,5] : selectedItems}
            />
        </Box>
    )
}

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [prices, setPrices] = useState([])
    const [discountPercents, setDiscountPercents] = useState([])
    const [ratings, setRatings] = useState([])
    const [stocks, setStocks] = useState([])
    const [productNames, setProductNames] = useState([])
    const [err, setErr] = useState("");

    useEffect(() => {
        const url = API_URLS.getAllProducts()
        fetch(url).then(res => {
            if (!res.ok)
                throw res.status;
            return res.json();
        }).then(resData => {
            console.log(resData?.products)
            const {pns, ps, dps, rs, ss} = dataPrep(resData?.products)
            setProductNames(pns)
            setPrices(ps)
            setDiscountPercents(dps)
            setRatings(rs)
            setStocks(ss)
            setProducts(resData?.products)
        }).catch(e => {
            setErr("Error fetching data")
        })
    }, []);

    return (
        <div>
            <HorizontalPanel productNames = {productNames} prices={prices} discountPercentage={discountPercents} ratings={ratings} stocks={stocks} />
            <DataTable products={products} setProductNames={setProductNames} setPrices={setPrices} setDiscountPercents={setDiscountPercents} setRatings={setRatings} setStocks={setStocks} />
        </div>
    )
}
