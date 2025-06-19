import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";

const DownloadTicketButton = ({ order, ticket }) => {
    const ticketContentRef = useRef(null);

    const generateTicketPDF = async () => {
        if (!ticketContentRef.current) {
            console.error("Ticket content not found for PDF generation.");
            return;
        }

        // Force layout/render
        await new Promise((resolve) => setTimeout(resolve, 100)); // allow time for browser to render hidden content

        const element = ticketContentRef.current;

        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#fff",
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(
            pageWidth / canvas.width,
            pageHeight / canvas.height
        );

        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;

        const marginX = (pageWidth - imgWidth) / 2;
        const marginY = 20;

        pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight);
        const filename = `${order.event.title.replace(
            /\s/g,
            "_"
        )}_${ticket.ticketId.name.replace(/\s/g, "_")}_Ticket.pdf`;
        pdf.save(filename);

        console.log("Canvas rendered:", canvas);
        console.log("Image data size:", imgData.length);
    };

    if (!order || !ticket || !order.event || !ticket.ticketId) {
        return null;
    }

    const TicketContentForPDF = () => (
        <div
            style={{
                padding: "20px",
                width: "600px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#ffffff",
                border: "2px solid #333",
                borderRadius: "10px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                color: "#333",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h2 style={{ margin: 0 }}>{order.event.title}</h2>
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Digital Ticket
                </span>
            </div>

            <hr />

            <div>
                <p>
                    <strong>Event Date:</strong>{" "}
                    {format(new Date(order.event.date), "MMM dd, yyyy")} at{" "}
                    {order.event.time}
                </p>
                <p>
                    <strong>Location:</strong> {order.event.location?.venue},{" "}
                    {order.event.location?.address},{" "}
                    {order.event.location?.city}
                </p>
            </div>

            <div style={{ borderTop: "1px dashed #aaa", paddingTop: "10px" }}>
                <h4>Ticket Details</h4>
                <p>
                    <strong>Type:</strong> {ticket.ticketId.name} (
                    {ticket.ticketId.type})
                </p>
                <p>
                    <strong>Price:</strong> ${ticket.ticketId.price.toFixed(2)}
                </p>
                <p>
                    <strong>Quantity:</strong> {ticket.quantity}
                </p>
                <p>
                    <strong>Attendee:</strong> {order.user?.name || "N/A"}
                </p>
            </div>

            <div style={{ borderTop: "1px dashed #aaa", paddingTop: "10px" }}>
                <h4>Order Information</h4>
                <p>
                    <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                    <strong>Transaction ID:</strong> {order.transactionId}
                </p>
                <p>
                    <strong>Purchase Date:</strong>{" "}
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <QRCodeCanvas
                    value={`${order._id}-${ticket.ticketId._id}`}
                    size={100}
                />
                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                    Scan to verify
                </p>
            </div>
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

            {/* Hidden div used for PDF generation */}
            <div
                ref={ticketContentRef}
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "0px",
                }}
            >
                <TicketContentForPDF />
            </div>
        </>
    );
};

export default DownloadTicketButton;
