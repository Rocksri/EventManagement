// src/components/DownloadTicketButton.jsx
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { format } from "date-fns"; // For date formatting

const DownloadTicketButton = ({ order, ticket }) => {
    // Ref to the hidden div that will contain the ticket content for capture
    const ticketContentRef = useRef(null);

    const generateTicketPDF = async () => {
        if (!ticketContentRef.current) {
            console.error("Ticket content not found for PDF generation.");
            return;
        }

        const element = ticketContentRef.current;
        const canvas = await html2canvas(element, { scale: 2 }); // Scale up for better quality
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width, canvas.height], // Set PDF dimensions to canvas dimensions
        });

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        // Define a filename for the download
        const filename = `${order.event.title.replace(
            /\s/g,
            "_"
        )}_${ticket.ticketId.name.replace(/\s/g, "_")}_Ticket.pdf`;
        pdf.save(filename);
    };

    if (!order || !ticket || !order.event || !ticket.ticketId) {
        return null; // Don't render button if essential data is missing
    }

    // You can customize the styling of your ticket content here.
    // This div will be hidden but used by html2canvas to generate the PDF.
    // Make sure the styling here is exactly how you want the PDF to look.
    const TicketContentForPDF = () => (
        <div
            style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
                width: "600px", // Set a fixed width for consistent PDF output
                boxSizing: "border-box",
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <h2
                style={{
                    color: "#333",
                    fontSize: "24px",
                    marginBottom: "10px",
                }}
            >
                {order.event.title}
            </h2>
            <p style={{ fontSize: "14px", color: "#555" }}>
                <strong style={{ minWidth: "80px", display: "inline-block" }}>
                    Event Date:
                </strong>{" "}
                {format(new Date(order.event.date), "MMM dd, yyyy")} at{" "}
                {order.event.time}
            </p>
            <p style={{ fontSize: "14px", color: "#555" }}>
                <strong style={{ minWidth: "80px", display: "inline-block" }}>
                    Location:
                </strong>{" "}
                {order.event.location?.venue}, {order.event.location?.address},{" "}
                {order.event.location?.city}
            </p>

            <div
                style={{
                    borderTop: "1px dashed #ccc",
                    padding: "15px 0",
                    marginTop: "15px",
                }}
            >
                <h3
                    style={{
                        color: "#333",
                        fontSize: "18px",
                        marginBottom: "10px",
                    }}
                >
                    Ticket Details
                </h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Ticket Type:
                    </strong>{" "}
                    {ticket.ticketId.name} ({ticket.ticketId.type})
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Price:
                    </strong>{" "}
                    ${ticket.ticketId.price.toFixed(2)}
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Quantity:
                    </strong>{" "}
                    {ticket.quantity}
                </p>
                {/* You might want to include attendee name here if available in order.user */}
                <p style={{ fontSize: '14px', color: '#555' }}><strong>Attendee:</strong> {order.user.name}</p>
            </div>

            <div
                style={{
                    borderTop: "1px dashed #ccc",
                    padding: "15px 0",
                    marginTop: "15px",
                }}
            >
                <h3
                    style={{
                        color: "#333",
                        fontSize: "18px",
                        marginBottom: "10px",
                    }}
                >
                    Order Information
                </h3>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Order ID:
                    </strong>{" "}
                    {order._id}
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Transaction ID:
                    </strong>{" "}
                    {order.transactionId}
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                    <strong
                        style={{ minWidth: "80px", display: "inline-block" }}
                    >
                        Purchase Date:
                    </strong>{" "}
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
            </div>

            {/* Placeholder for QR Code / Barcode (You'd use a library like qrcode.react here) */}
            {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
                <img src="path/to/qr_code_image_or_generated_data" alt="QR Code" style={{ width: '100px', height: '100px' }} />
                <p style={{ fontSize: "12px", color: "#777" }}>
                    Scan for entry
                </p>
            </div> */}
        </div>
    );

    return (
        <>
            <button
                onClick={generateTicketPDF}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
                Download Ticket
            </button>

            {/* This div is hidden from view but used by html2canvas for PDF generation */}
            <div
                ref={ticketContentRef}
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                }}
            >
                <TicketContentForPDF />
            </div>
        </>
    );
};

export default DownloadTicketButton;
