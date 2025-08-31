import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
function MygaResultsDisplay({ data, clientData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return "N/A";
    const today = dayjs();
    const birthDate = dayjs(birthday);
    return today.diff(birthDate, "year");
  };

  // Get client display name and age from the actual form data
  const clientDisplayName =
    clientData?.first_name && clientData?.last_name
      ? `${clientData.first_name} ${clientData.last_name}`
      : "Client";
  const clientAge = calculateAge(clientData?.birthday);

  // Available data series for the chart
  const availableDataSeries = [
    {
      key: "withdrawals1",
      name: "Withdrawals¹",
      dataIndex: 3,
      color: "#ff9800",
    },
    {
      key: "accumulationValue1",
      name: "Accumulation Value¹",
      dataIndex: 4,
      color: "#1976d2",
    },
    {
      key: "surrenderValue1",
      name: "Surrender Value¹",
      dataIndex: 5,
      color: "#dc004e",
    },
    {
      key: "withdrawals2",
      name: "Withdrawals²",
      dataIndex: 6,
      color: "#ff5722",
    },
    {
      key: "accumulationValue2",
      name: "Accumulation Value²",
      dataIndex: 7,
      color: "#2e7d32",
    },
    {
      key: "surrenderValue2",
      name: "Surrender Value²",
      dataIndex: 8,
      color: "#9c27b0",
    },
  ];

  // State for selected data series (default to Accumulation Value¹ and Surrender Value¹)
  const [selectedSeries, setSelectedSeries] = useState([
    "accumulationValue1",
    "surrenderValue1",
  ]);

  // Add comprehensive debugging
  console.log("MygaResultsDisplay received data:", data);
  console.log("Data validation:", {
    hasData: !!data,
    hasIllustrationCalcData: !!data?.illustration_calc_data,
    hasDataArray: !!data?.illustration_calc_data?.data,
    isDataArray: Array.isArray(data?.illustration_calc_data?.data),
    dataKeys: data ? Object.keys(data) : "no data",
  });

  // Updated data validation - check for the actual structure
  if (
    !data ||
    !data.illustration_calc_data ||
    !Array.isArray(data.illustration_calc_data.data)
  ) {
    console.log("Data validation failed:", {
      data: !!data,
      illustrationCalcData: !!data?.illustration_calc_data,
      dataArray: !!data?.illustration_calc_data?.data,
      isArray: Array.isArray(data?.illustration_calc_data?.data),
    });
    return (
      <Box>
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              No calculation data available. Please ensure the calculation
              completed successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Debug:{" "}
              {data
                ? `Received data with keys: ${Object.keys(data).join(", ")}`
                : "No data received"}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[,$]/g, ""))
        : value;
    
    const absValue = Math.abs(numValue || 0);
    
    if (absValue >= 1000000000) {
      return `$${(numValue / 1000000000).toFixed(1)}B`;
    } else if (absValue >= 1000000) {
      return `$${(numValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `$${(numValue / 1000).toFixed(1)}K`;
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue || 0);
    }
  };

  // Transform data for MUI Table
  const tableData = useMemo(() => {
    if (
      !data?.illustration_calc_data?.data ||
      !Array.isArray(data.illustration_calc_data.data)
    ) {
      return [];
    }

    return data.illustration_calc_data.data.map((row) => ({
      age: row[0],
      year: row[1],
      initialPremium: row[2],
      withdrawals1: row[3],
      accumulationValue1: row[4],
      surrenderValue1: row[5],
      withdrawals2: row[6],
      accumulationValue2: row[7],
      surrenderValue2: row[8],
    }));
  }, [data]);

  // Add pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSeriesChange = (event) => {
    const value = event.target.value;
    setSelectedSeries(typeof value === "string" ? value.split(",") : value);
  };

  // Highcharts configuration with dynamic series based on selection
  const chartOptions = useMemo(() => {
    const dynamicSeries = selectedSeries
      .map((seriesKey) => {
        const seriesConfig = availableDataSeries.find(
          (s) => s.key === seriesKey
        );
        if (!seriesConfig) return null;

        return {
          name: seriesConfig.name,
          data: data.illustration_calc_data?.data
            ? data.illustration_calc_data.data.map((row) => {
                const value = row[seriesConfig.dataIndex];
                return typeof value === "string"
                  ? parseFloat(value.replace(/[,$]/g, ""))
                  : parseFloat(value) || 0;
              })
            : [],
          color: seriesConfig.color,
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 4,
          },
        };
      })
      .filter(Boolean);

    return {
      title: {
        text: `MYGA Account Value Progression (${data.illustration_calc_data?.durations || 0} Years)`,
      },
      xAxis: {
        title: { text: "Year" },
        categories: data.illustration_calc_data?.data
          ? data.illustration_calc_data.data.map((row) => row[1])
          : [],
      },
      yAxis: {
        title: { text: "Account Value ($)" },
        labels: {
          formatter: function () {
            return formatCurrency(this.value);
          },
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>Year ${this.x}</b><br/>${this.series.name}: ${formatCurrency(this.y)}`;
        },
      },
      series: dynamicSeries,
      legend: {
        enabled: true,
        layout: "horizontal",
        align: "center",
        verticalAlign: "bottom",
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false,
          },
          enableMouseTracking: true,
        },
      },
    };
  }, [data, selectedSeries]);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="series-select-label">
                Select Data Series
              </InputLabel>
              <Select
                label="Select Data Series"
                size="small"
                multiple
                value={selectedSeries}
                onChange={handleSeriesChange}
                input={<OutlinedInput label="Select Data Series to Display" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const series = availableDataSeries.find(
                        (s) => s.key === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={series?.name || value}
                          size="small"
                          sx={{
                            backgroundColor: series?.color + "20",
                            color: series?.color,
                            border: `1px solid ${series?.color}`,
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {availableDataSeries.map((series) => (
                  <MenuItem key={series.key} value={series.key}>
                    <Checkbox
                      checked={selectedSeries.indexOf(series.key) > -1}
                      sx={{
                        color: series.color,
                        "&.Mui-checked": { color: series.color },
                      }}
                    />
                    <ListItemText primary={series.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Chart */}
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </CardContent>
      </Card>

      {/* MUI Data Table */}
      <Card>
        <CardContent>
          <Typography
            variant="subtitle2"
            sx={{ mb: 2 }}
            className="textColor mb-2"
          >
            Illustrated Values Ledger
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    rowSpan={2}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Age
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Year
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Initial Premium
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Guaranteed
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    Non-Guaranteed
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Withdrawals
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Accumulation Value
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Surrender Value
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Withdrawals
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Accumulation Value
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Surrender Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.age}</TableCell>
                    <TableCell align="center">{row.year}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.initialPremium)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.withdrawals1)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.accumulationValue1)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.surrenderValue1)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.withdrawals2)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.accumulationValue2)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.surrenderValue2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            // labelDisplayedRows={({ from, to, count }) =>
            //   `${clientDisplayName} (Age ${clientAge}): ${from}-${to} of ${count}`
            // }
            labelRowsPerPage="Rows per page:"
          />

          <Button
            className="!rounded-full !-mt-8"
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
          >
            Export PDF
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MygaResultsDisplay;
