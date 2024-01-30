import React, { useEffect, useState } from 'react'
import { API_URLS } from '../constants/urls'
import { Box, Tab, Tabs, Typography, Stack, TextField, Checkbox } from "@mui/material"
import PropTypes from "prop-types"
import Plot from "react-plotly.js"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
//future reference
// import { DataGrid } from "@mui/x-data-grid"
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
                    width: 11*screenWidth/12,
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
         className='tabpanel'
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
            <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "#fff" }}>
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

    const [selectedItems, setSelectedItems] = useState([1,2,3,4,5])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [total, setTotal] = useState(0)

    const {products, setProducts, setProductNames, setPrices, setDiscountPercents, setRatings, setStocks} = props

    // future reference
    // const columns = [
    //     {field: 'id', headerName: 'ID', width: 200},
    //     {field: 'title', headerName: 'Title', width: 200},
    //     {field: 'brand', headerName: 'Brand', width: 200},
    //     {field: 'category', headerName: 'Category', width: 200},
    //     {field: 'description', headerName: 'Description', width: 200},
    //     {field: 'price', headerName: 'Price', sortable: true},
    //     {field: 'discountPercentage', headerName: 'Discount Percentage', sortable: true, width: 200},
    //     {field: 'rating', headerName: 'Rating', sortable: true, width: 200},
    //     {field: 'stock', headerName: 'Stock', sortable: true, width: 200},
    // ]

    // const rows = products.map(item => {
    //     return {id: item?.id, title: item?.title, brand: item?.brand, category: item?.category, description: item?.description, price: item?.price, discountPercentage: item?.discountPercentage, rating: item?.rating, stock: item?.stock}
    // })

    let abortController;

    const searchHandler = (event) => {
        const search = event.target.value;
        const url = API_URLS.searchProduct(search)
        if (typeof abortController !== typeof undefined) {
            abortController.abort()
        }

        abortController = new AbortController()

        fetch(url, {
            signal: abortController.signal
        }).then(res => {
            if(!res.ok) {
                throw res.status
            }
            return res.json()
        }).then(resData => {
            setProducts(resData?.products)
            setTotal(resData?.total)
            setPage(0)
            const {pns, ps, dps, rs, ss} = dataPrep(resData?.products, selectedItems)
            setProductNames(pns)
            setPrices(ps)
            setDiscountPercents(dps)
            setRatings(rs)
            setStocks(ss)
        }).catch(e=>{
            console.log(e)
        })

    } 

    const hanglePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

      useEffect(() => {
        const url = API_URLS.getAllProducts(rowsPerPage === -1 ? 0 : rowsPerPage*(page+1))
        fetch(url).then(res => {
            if (!res.ok)
                throw res.status;
            return res.json();
        }).then(resData => {
            console.log(resData?.products)
            setTotal(resData?.total)
            const {pns, ps, dps, rs, ss} = dataPrep(resData?.products, selectedItems)
            setProductNames(pns)
            setPrices(ps)
            setDiscountPercents(dps)
            setRatings(rs)
            setStocks(ss)
            setProducts(resData?.products)
        }).catch(e => {
            console.log("Error fetching data")
        })
    }, [page, rowsPerPage]);

    return (
        <Box className="data-table" sx={{  width: "-webkit-fill-available", height: "auto", backgroundColor: "#fff"}}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant='h4'>
                    Data Table
                </Typography>
                <TextField label="Search product" onChange={searchHandler} InputProps={{ type: "search" }} style={{ width: "50%" }} />
            </Stack>
            {/* 
            future reference
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 100
                    }
                },
                
              }}
              checkboxSelection
              disableRowSelectionOnClick
              rowThreshold={10}
              rowBuffer={5}
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
              style={{
                overflow: "scroll",
                height: "70vh",
                position: "relative",
                marginBlock: 10
              }}
            /> */}
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: "60vh" }}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {/* <Checkbox id='check-0' /> */}
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Id</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Title</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Brand</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Category</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Description</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Price</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Discount</Typography> Percentage
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Rating</Typography>
                            </TableCell>
                            <TableCell align='center'>
                                <Typography variant="h6">Stock</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? products.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage) : products).map((product, index) => (
                            <TableRow>
                                <TableCell align='center'>
                                    <Checkbox id={`check-id-${index}`} checked={selectedItems.includes(product?.id)} onChange={(event) => {
                                        let temp = [...selectedItems];
                                        if (event.target.checked) {
                                            temp.push(product.id)
                                        } else {
                                            const i = temp.indexOf(product.id)
                                            temp.splice(i, 1)
                                        }
                                        setSelectedItems(temp)
                                        const {pns, ps, dps, rs, ss} = dataPrep(products, temp)
                                            setProductNames(pns)
                                            setPrices(ps)
                                            setDiscountPercents(dps)
                                            setRatings(rs)
                                            setStocks(ss)
                                    }} />
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.id}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.title}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.brand}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.category}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.description}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.price}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.discountPercentage}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.rating}
                                </TableCell>
                                <TableCell align='center'>
                                    {product?.stock}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
               rowsPerPageOptions={[20, 50, { label: 'All', value: -1 }]}
               count={total}
               rowsPerPage={rowsPerPage}
               page={page}
               onPageChange={hanglePageChange}
               onRowsPerPageChange={handleChangeRowsPerPage}
               component="div"
            />
            </Paper>
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

    return (
        <div>
            <HorizontalPanel productNames = {productNames} prices={prices} discountPercentage={discountPercents} ratings={ratings} stocks={stocks} />
            <DataTable products={products} setProducts={setProducts} setProductNames={setProductNames} setPrices={setPrices} setDiscountPercents={setDiscountPercents} setRatings={setRatings} setStocks={setStocks} />
        </div>
    )
}
