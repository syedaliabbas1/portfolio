const testContactForm = async () => {
  try {
    console.log("🧪 Testing Contact Form API...\n");

    const testData = {
      name: "Syed Ali Abbas - Test",
      email: "test@portfolio.com",
      company: "UCL",
      message:
        "This is a demo message to verify the contact form is working correctly. If you receive this email at syedaliabbas1124@gmail.com, your contact form integration is successful! ✅",
    };

    console.log("📤 Sending test message:");
    console.log(JSON.stringify(testData, null, 2));
    console.log("\n⏳ Please wait...\n");

    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log("=".repeat(60));
    if (response.ok) {
      console.log("✅ SUCCESS! Contact form is working perfectly!");
      console.log("📧 Email has been sent to: syedaliabbas1124@gmail.com");
      console.log("\nResponse:", result);
      console.log("\n📬 Please check your email inbox!");
      console.log("   (Also check spam folder just in case)");
    } else {
      console.log("❌ FAILED! Error occurred:");
      console.log("Status:", response.status);
      console.log("Error:", result);
    }
    console.log("=".repeat(60));
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("\n⚠️  Make sure your dev server is running:");
    console.log("   npm run dev");
  }
};

testContactForm();
