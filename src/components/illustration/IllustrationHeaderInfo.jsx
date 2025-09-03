import React, { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useApp } from "../AppProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function IllustrationHeaderInfo({ handleBasicInfo }) {
  const { user } = useApp();
  const [illustrationNumber, setIllustrationNumber] = useState(null);
  const generateIllustrationNumber = () => {
    let illustrationVal = String(Math.floor(Math.random() * 1e8)).padStart(
      8,
      "0"
    );
    setIllustrationNumber(`CLIN-${illustrationVal}`);
    if (handleBasicInfo) {
      const basicInfo = {
        Agent_Name: user?.name,
        Illustration_Number: `CLIN-${illustrationVal}`,
        llustration_Date: dayjs(),
      };
      handleBasicInfo(basicInfo);
    }
  };
  useEffect(() => {
    generateIllustrationNumber();
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Agent Name"
          variant="outlined"
          value={user?.name}
          sx={{ minWidth: "300px", mb: 2 }}
          size="small"
        />
        <TextField
          id="outlined-basic"
          label="Illustration Number"
          variant="outlined"
          value={illustrationNumber}
          sx={{ minWidth: "300px", mb: 2 }}
          size="small"
          disabled={true}
          InputProps={{ readOnly: true }}
        />
        <DatePicker
          label="Illustration Date"
          sx={{ minWidth: "300px", mb: 2 }}
          defaultValue={dayjs()}
          slotProps={{
            textField: {
              size: "small",
            },
          }}
        />
      </Box>
    </>
  );
}

export default IllustrationHeaderInfo;
