import { getCurrentUser } from "@/app/_actions/auth";
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Form from "./_components/form";

interface PageProps {
  params: {
    companyID: string;
  };
}

const page = async ({ params }: PageProps) => {
  // Get current user for authentication/authorization if needed
  await getCurrentUser();

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
          backgroundAttachment: "fixed",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form companyId={params.companyID} />
        </Box>
      </Box>
    </>
  );
};

export default page;
