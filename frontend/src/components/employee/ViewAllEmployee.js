import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import SoloAlert from 'soloalert'
import validation from 'validator'
import jspdf from 'jspdf'
import "jspdf-autotable"

export default function ViewAllEmployee() {

    const [loaderStatus, setLoaderStatus] = useState(false);
    const [tebleStatus, setTableStatus] = useState(true);


    const [search, setsearch] = useState("");
    const [filtered, setfiltered] = useState([]);

    const [AllEmployee, setAllEmployee] = useState([]);





    //This useEffect function used to get all rooms data
    useEffect(() => {
        async function getDetails() {
            try {
                const result = await (await axios.get("http://localhost:5000/employees/")).data.data
                setAllEmployee(result);
                setLoaderStatus(true)
                setTableStatus(false)
            } catch (err) {
                console.log(err.message)
            }
        }

        getDetails();
    })


    //This useEffect method is used to perform a searching function
    useEffect(() => {
        setfiltered(
            AllEmployee.filter(items => {
                return items.empid.toLowerCase().includes(search.toLowerCase())
                    || items.firstname.toLowerCase().includes(search.toLowerCase())
                    || items.lastname.toLowerCase().includes(search.toLowerCase())
            })
        )

    }, [search, AllEmployee])


    //This function used to generate a pdf
    function generatePDF(tickets) {
        const doc = new jspdf();
        const tableColumn = ["empid", "firstname", "lastname", "emptype", "nic", "mobile","bank","branch"];
        const tableRows = [];

        tickets.slice(0).reverse().map(ticket => {
            const ticketData = [
                ticket.empid,
                ticket.firstname,
                ticket.lastname,
                ticket.emptype,
                ticket.nic,
                ticket.mobile,
                ticket.bank,
                ticket.branch,
            ];
            tableRows.push(ticketData);
        });

        doc.autoTable(tableColumn, tableRows, { styles: { fontSize: 8 }, startY: 35 });
        const date = Date().split(" ");
        const dateStr = date[1] + "-" + date[2] + "-" + date[3];
        doc.text("Added-Employee-Report", 14, 15).setFontSize(12);
        doc.text(`Report Generated Date - ${dateStr} `, 14, 23);
        doc.save(`Room-Details-Report_${dateStr}.pdf`);

    }


    return (
        <div class="content">

            <div class="d-flex justify-content-center" >
                <div class="spinner-border" role="status" style={{ width: "10rem", height: "10rem", marginTop: "100px" }} hidden={loaderStatus}>
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <div hidden={tebleStatus}>{/* This part used to get all users data into table */}
                <nav className="navbar bg-white" >
                    <div className="container-fluid">
                        <h3>Rooms</h3>
                        <button type="button" class="btn btn-outline-danger" id="pdfButton" onClick={(e) => { generatePDF(AllEmployee) }}><i className="fa fa-file-pdf"></i>  PDF</button>
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                                onChange={e => { setsearch(e.target.value) }} />
                        </form>
                    </div>
                </nav><hr />

                <div className="bodyContent">
                    <table className="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th scope="col">empid</th>
                                <th scope="col">firstname</th>
                                <th scope="col">lastname</th>
                                <th scope="col">emptype</th>
                                <th scope="col">nic</th>
                                <th scope="col">mobile</th>
                                <th scope="col">bank</th>
                                <th scope="col">branch</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {filtered.slice(0).reverse().map((Employee) => {
                                return <tr>
                                    <td>{Employee.empid}</td>
                                    <td>{Employee.firstname}</td>
                                    <td> {Employee.lastname} </td>
                                    <td>{Employee.emptype}</td>
                                    <td> {Employee.nic} </td>
                                    <td>{Employee.mobile}</td>
                                    <td>{Employee.bank}</td>
                                    <td>{Employee.branch}</td>
                                    <td><Link to={"#" + Employee._id} className="Edit"> <i className="far fa-edit"></i> </Link></td>
                                </tr>

                            })}
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    )
}