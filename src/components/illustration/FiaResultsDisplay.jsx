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
function FiaResultsDisplay({ data, clientData }) {
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
    { key: "initialPremium", name: "Initial Premium", color: "#9c27b0" },
    { key: "creditedInterest", name: "Credited Interest", color: "#1976d2" },
    { key: "withdrawals", name: "Withdrawals", color: "#ff9800" },
    { key: "accumulationValue", name: "Accumulation Value", color: "#4caf50" },
    { key: "surrenderValue", name: "Surrender Value", color: "#ff5722" },
    { key: "deathBenefit", name: "Death Benefit", color: "#2e7d32" },
  ];

  // State for selected data series (default to Accumulation Value and Surrender Value)
  const [selectedSeries, setSelectedSeries] = useState([
    "accumulationValue",
    "surrenderValue",
  ]);

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

  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "$0";
    
    const numValue = parseFloat(value);
    const absValue = Math.abs(numValue);
    
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
      }).format(numValue);
    }
  };

  // Helper function to safely parse currency strings or numbers
  const parseCurrencyValue = (value) => {
    if (typeof value === "string") {
      // Remove currency symbols and commas, then parse
      const cleanValue = value.replace(/[$,]/g, "");
      return parseFloat(cleanValue) || 0;
    }
    return parseFloat(value) || 0;
  };

  const tableData = useMemo(() => {
    if (!data?.illustration_calc_data?.data) return [];

    console.log("Raw API data:", data.illustration_calc_data.data);

    return data.illustration_calc_data.data.map((row, index) => {
      const mappedRow = {
        age: row[0],
        year: row[1],
        initialPremium: parseCurrencyValue(row[2]),
        creditedInterest: parseCurrencyValue(row[3]),
        withdrawals: parseCurrencyValue(row[4]),
        accumulationValue: parseCurrencyValue(row[5]),
        surrenderValue: parseCurrencyValue(row[6]),
        deathBenefit: parseCurrencyValue(row[7]),
      };

      if (index === 0) {
        console.log("First row mapping:", mappedRow);
      }

      return mappedRow;
    });
  }, [data]);

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
          data: tableData.map((row) => row[seriesKey]),
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
      chart: {
        type: "line",
        height: 400,
      },
      title: {
        text: `FIA Account Value Progression (${data?.illustration_calc_data?.durations || 0} Years)`,
      },
      xAxis: {
        title: { text: "Year" },
        categories: data?.illustration_calc_data?.data
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
  }, [tableData, selectedSeries, data]);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Data Series</InputLabel>
              <Select
                label="Select Data Series"
                size="small"
                multiple
                value={selectedSeries}
                onChange={handleSeriesChange}
                input={<OutlinedInput label="Select Data Series" />}
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
                      sx={{ color: series.color }}
                    />
                    <ListItemText
                      primary={series.name}
                      sx={{ color: series.color }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }} className="textColor">
            Illustrated Values Ledger
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Age</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell align="right">Initial Premium</TableCell>
                  <TableCell align="right">Credited Interest</TableCell>
                  <TableCell align="right">Withdrawals</TableCell>
                  <TableCell align="right">Accumulation Value</TableCell>
                  <TableCell align="right">Surrender Value</TableCell>
                  <TableCell align="right">Death Benefit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.year}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.initialPremium)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.creditedInterest)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.withdrawals)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.accumulationValue)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.surrenderValue)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(row.deathBenefit)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
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
          <Box sx={{ mb: 2 }}>
            <Button
              className="!rounded-full !-mt-8"
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
            >
              Export PDF
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FiaResultsDisplay;
