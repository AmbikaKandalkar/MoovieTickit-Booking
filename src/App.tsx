import {
  Button,
  Container,
  FormControl,
  Grid,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import DialogBox from './components/DialogComponent';

type SeatingCategory = "platinum" | "gold" | "silver";

type ShowSeating = {
  [category in SeatingCategory]: string[];
};

type Shows = {
  [showKey: string]: ShowSeating;
};

type SeatPrices = {
  [category in SeatingCategory]: number;
};

const App = () => {

  const initialSeating: Shows = {
    show1: {
      platinum: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9"],
      gold: ["B1", "B2", "B3", "B4", "B5", "B6"],
      silver: ["C2", "C3", "C4", "C5", "C6", "C7"],
    },
    show2: {
      platinum: ["A1", "A2", "A3", "A4", "A5", "A6", "A7"],
      gold: ["B2", "B3", "B4", "B5", "B6"],
      silver: ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
    },
    show3: {
      platinum: ["A1", "A2", "A3", "A4", "A5", "A6", "A7"],
      gold: ["B3", "B4", "B5", "B6", "B7"],
      silver: ["C1", "C2", "C3", "C4", "C5"],
    },
  };

  const seatPrices: SeatPrices = {
    platinum: 320,
    gold: 280,
    silver: 240,
  };

  const [shows, setShows] = useState<Shows>(initialSeating);
  const [revenue, setRevenue] = useState<number>(0);
  const [serviceTax, setServiceTax] = useState<number>(0);
  const [swachhCess, setSwachhCess] = useState<number>(0);
  const [krishiCess, setKrishiCess] = useState<number>(0);
  const [selectedShow, setSelectedShow] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [currentBooking, setCurrentBooking] = useState<{
    category: SeatingCategory;
    seat: string;
    showKey: string;
  } | null>(null);


  const calculateCost = (category: SeatingCategory): number => {
    const showCost = seatPrices[category];
    const tax = (showCost * 14) / 100;
    const swachh = (showCost * 0.5) / 100;
    const krishi = (showCost * 0.5) / 100;
    return showCost + tax + swachh + krishi;
  };

  const onSeatClcik = (
    category: SeatingCategory,
    seat: string,
    showKey: string
  ) => {
    setOpenDialog(true);

    setCurrentBooking({ category, seat, showKey });
  };

  const handleConfirmBooking = () => {
    if (!currentBooking) return;

    const { category, seat, showKey } = currentBooking;

    const updatedShow = { ...shows[showKey] };
    updatedShow[category] = updatedShow[category].filter((s) => s !== seat);

    const showCost = seatPrices[category];
    const tax = (showCost * 14) / 100;
    const swachh = (showCost * 0.5) / 100;
    const krishi = (showCost * 0.5) / 100;

    setRevenue((prev) => prev + showCost);
    setServiceTax((prev) => prev + tax);
    setSwachhCess((prev) => prev + swachh);
    setKrishiCess((prev) => prev + krishi);
    setShows({ ...shows, [showKey]: updatedShow });

    setOpenDialog(false);
  };


  return (
    <Container sx={{ position: "relative", height: "100vh" }}>
      <Typography variant="h4"  >
        Movie Theatre Booking System
      </Typography>

      <FormControl fullWidth margin="normal">
        {!selectedShow && <InputLabel id="select-show-label">Select Show</InputLabel>}
        <Select
          variant="outlined"
          value={selectedShow}
          onChange={(e) => setSelectedShow(e.target.value)}
        >
          <MenuItem value="">Select Show</MenuItem>
          <MenuItem value="show1">Show 1 (Audi 1)</MenuItem>
          <MenuItem value="show2">Show 2 (Audi 2)</MenuItem>
          <MenuItem value="show3">Show 3 (Audi 3)</MenuItem>
        </Select>
      </FormControl>

      {selectedShow && (
        <React.Fragment>
          <Typography variant="h5">
            Available Seats for {selectedShow.toUpperCase()}:
          </Typography>
          {Object.keys(shows[selectedShow]).map((category) => (
            <div key={category}>
              <Typography variant="h6">
                {category.charAt(0).toUpperCase() + category.slice(1)} Seats (Rs. {" "}
                {seatPrices[category as SeatingCategory]}):
              </Typography>
              <Grid2 container spacing={1} mt={1}>
                {shows[selectedShow][category as SeatingCategory].length > 0 ? (
                  shows[selectedShow][category as SeatingCategory].map((seat) => (
                    <Grid2 key={seat}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          onSeatClcik(
                            category as SeatingCategory,
                            seat,
                            selectedShow
                          )
                        }
                      >
                        {seat}
                      </Button>
                    </Grid2>
                  ))
                ) : (
                  <Typography variant="body2">No seats available</Typography>
                )}
              </Grid2>
            </div>
          ))}
        </React.Fragment>
      )}
 
      <Grid2 sx={{ position: "absolute", bottom: "16px" }}>
        <Typography variant="h5" gutterBottom>
          Final Revenue Summary
        </Typography>
        <Typography variant="body1">Revenue: Rs. {revenue.toFixed(2)}</Typography>
        <Typography variant="body1">
          Service Tax: Rs. {serviceTax.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Swachh Bharat Cess: Rs. {swachhCess.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Krishi Kalyan Cess: Rs. {krishiCess.toFixed(2)}
        </Typography>
      </Grid2>

      {openDialog && <DialogBox onClose={() => setOpenDialog(false)} openDialog={openDialog}>
        <Grid2 container spacing={2}>
         <Grid2 size={12}>
         <Typography variant='subtitle1'>
            Are you sure you want to book this seat? cost including all taxes: Rs.{" "}
            {currentBooking && calculateCost(currentBooking.category).toFixed(2)}
          </Typography>
         </Grid2>

          <Grid2 size={12} sx={{display:"flex", justifyContent:"space-around"}}>
          <Button onClick={() => setOpenDialog(false)} variant='outlined'>
            No
          </Button>
          <Button onClick={handleConfirmBooking} variant='outlined'>
            Yes
          </Button>
          </Grid2>

       </Grid2>
      </DialogBox>}
    </Container>
  );
};

export default App;
