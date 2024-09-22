"use client";
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  { rank: "1", team: "Paid$250.00", gw: "234" },
  { rank: "2", team: "Pending$150.00", gw: "98" },
  { rank: "3", team: "Unpaid$350.00", gw: "76" },
  { rank: "4", team: "Paid$450.00", gw: "234" },
  { rank: "5", team: "Paid$550.00", gw: "98" },
  { rank: "6", team: "Pending$200.00", gw: "76" },
  { rank: "7", team: "Unpaid$300.00", gw: "234" },
  { rank: "8", team: "Paid$400.00", gw: "98" },
  { rank: "9", team: "Pending$500.00", gw: "234" },
  { rank: "10", team: "Unpaid$600.00", gw: "76" },
  { rank: "11", team: "Paid$700.00", gw: "234" },
  { rank: "12", team: "Pending$800.00", gw: "98" },
  { rank: "13", team: "Unpaid$900.00", gw: "76" },
  { rank: "14", team: "Paid$1000.00", gw: "234" },
  { rank: "15", team: "Paid$1100.00", gw: "98" },
]

export default function Leaderboards() {
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  const totalPages = Math.ceil(invoices.length / recordsPerPage)

  const paginatedInvoices = invoices.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <>
    <div className="flex w-full justify-center items-center pt-[80px]">
   <div className="flex flex-col justify-center items-center container max-w-4xl">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Team & Manager	</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {paginatedInvoices.map((invoice, key) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{invoice.rank}</TableCell>
              <TableCell className="font-semibold text-[#37003c]">{invoice.team}</TableCell>
              <TableCell className="text-right">{invoice.gw}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-16 w-full">
        <button
          className="px-4 py-2 bg-button rounded"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-button rounded"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
   </div>
   </>

  )
}
