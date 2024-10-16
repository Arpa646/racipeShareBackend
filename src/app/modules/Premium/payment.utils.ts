import axios from "axios";

export const initiatePayment = async (paymentData: any) => {
  const url = "https://sandbox.aamarpay.com/jsonpost.php";

  try {
    const response = await axios.post(url, {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      tran_id: paymentData.transactionId, // Ideally, generate a unique transaction ID
      success_url: `http://localhost:5000/api/premium/success?transactionid=${paymentData.userId}`,
      fail_url: "https://flourishing-stroopwafel-629c6d.netlify.app",
      cancel_url: "https://flourishing-stroopwafel-629c6d.netlify.app",
      amount: 100,
      currency: "BDT",

      desc: "Facility Booking Payment",
      cus_name: "arpa",
      cus_email: "arpakhan114@gmail.com",
      cus_add1: "dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1206",
      cus_country: "Bangladesh",
      cus_phone: "03834",
      type: "json",
    });

    //    const verifyPayment=async() =>{

    //     const res=await axios.get("https://sandbox.aamarpay.com/api/v1/trxcheck/request.php",{
    //       params:{
    //         store_id: "aamarpaytest",
    //         signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
    //         request_id:tran_id,
    //         type: "json",

    //       }
    //     })

    //     console.log('jhh',res.data)
    //    }

    return response;
  } catch (error) {
    console.error("Payment initiation failed", error);
    throw new Error("Payment initiation failed");
  }
};
