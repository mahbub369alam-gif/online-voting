export const sendMessage = async (phoneNumber, message) => {
  try {
    if (!phoneNumber || !message) {
      return { success: false, error: "Phone number and message are required" };
    }

    // check if phone number has 11 digits and starts with 88
    if (phoneNumber.length !== 11) {
      return { success: false, error: "Invalid phone number" };
    }

    // if 88 not exist in phone number add 88 at the start
    if (!phoneNumber.startsWith("88")) {
      phoneNumber = "88" + phoneNumber;
    }

    const formData = {
      UserName: process.env.SMS_USERNAME,
      Apikey: process.env.SMS_API_KEY,
      MobileNumber: phoneNumber,
      CampaignId: "null",
      SenderName: process.env.SMS_SENDER_ID,
      TransactionType: "T",
      Message: message,
    };

    const res = await fetch("https://api.mimsms.com/api/SmsSending/SMS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.statusCode == 200) {
      return { success: true, ...data };
    } else {
      return { success: false, ...data };
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: err };
  }
};
