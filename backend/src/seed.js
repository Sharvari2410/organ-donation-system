require("dotenv").config({ override: true });
const mongoose = require("mongoose");
const Donor = require("./models/Donor");
const Recipient = require("./models/Recipient");

const donorData = [
  { name: "Rahul Sharma", age: 28, bloodGroup: "O+", organ: "Kidney", location: "Pune" },
  { name: "Priya Mehta", age: 32, bloodGroup: "A+", organ: "Liver", location: "Mumbai" },
  { name: "Aman Verma", age: 25, bloodGroup: "B+", organ: "Kidney", location: "Delhi" },
  { name: "Neha Singh", age: 30, bloodGroup: "AB+", organ: "Liver", location: "Jaipur" },
  { name: "Rohan Patil", age: 35, bloodGroup: "O-", organ: "Kidney", location: "Nagpur" },
  { name: "Kavya Nair", age: 27, bloodGroup: "A-", organ: "Liver", location: "Kochi" },
  { name: "Saurabh Jain", age: 40, bloodGroup: "B-", organ: "Kidney", location: "Indore" },
  { name: "Isha Kapoor", age: 29, bloodGroup: "AB-", organ: "Liver", location: "Chandigarh" },
  { name: "Manoj Rao", age: 33, bloodGroup: "O+", organ: "Kidney", location: "Hyderabad" },
  { name: "Sneha Kulkarni", age: 31, bloodGroup: "A+", organ: "Liver", location: "Pune" },
  { name: "Arjun Das", age: 26, bloodGroup: "B+", organ: "Kidney", location: "Kolkata" },
  { name: "Nidhi Bansal", age: 34, bloodGroup: "AB+", organ: "Liver", location: "Noida" },
  { name: "Yash Choudhary", age: 38, bloodGroup: "O-", organ: "Kidney", location: "Surat" },
  { name: "Meera Iyer", age: 24, bloodGroup: "A-", organ: "Liver", location: "Chennai" },
  { name: "Dev Malhotra", age: 36, bloodGroup: "B-", organ: "Kidney", location: "Bhopal" },
  { name: "Ritika Sen", age: 28, bloodGroup: "AB-", organ: "Liver", location: "Lucknow" },
  { name: "Nikhil Joshi", age: 41, bloodGroup: "O+", organ: "Kidney", location: "Ahmedabad" },
  { name: "Pooja Reddy", age: 30, bloodGroup: "A+", organ: "Liver", location: "Vijayawada" },
  { name: "Harsh Gupta", age: 27, bloodGroup: "B+", organ: "Kidney", location: "Kanpur" },
  { name: "Tanya Roy", age: 33, bloodGroup: "AB+", organ: "Liver", location: "Patna" },
];

const recipientData = [
  { name: "Anita Verma", age: 35, bloodGroup: "O+", requiredOrgan: "Kidney", urgency: "High" },
  { name: "Karan Malhotra", age: 22, bloodGroup: "A+", requiredOrgan: "Liver", urgency: "Medium" },
  { name: "Riya Sinha", age: 44, bloodGroup: "B+", requiredOrgan: "Kidney", urgency: "Critical" },
  { name: "Gaurav Nanda", age: 29, bloodGroup: "AB+", requiredOrgan: "Liver", urgency: "High" },
  { name: "Farhan Ali", age: 50, bloodGroup: "O-", requiredOrgan: "Kidney", urgency: "Critical" },
  { name: "Bhavna Shah", age: 31, bloodGroup: "A-", requiredOrgan: "Liver", urgency: "Medium" },
  { name: "Ramesh Yadav", age: 47, bloodGroup: "B-", requiredOrgan: "Kidney", urgency: "High" },
  { name: "Sakshi Arora", age: 26, bloodGroup: "AB-", requiredOrgan: "Liver", urgency: "Low" },
  { name: "Vikram P", age: 39, bloodGroup: "O+", requiredOrgan: "Kidney", urgency: "Medium" },
  { name: "Shreya S", age: 34, bloodGroup: "A+", requiredOrgan: "Liver", urgency: "Critical" },
  { name: "Abhishek M", age: 42, bloodGroup: "B+", requiredOrgan: "Kidney", urgency: "High" },
  { name: "Komal D", age: 24, bloodGroup: "AB+", requiredOrgan: "Liver", urgency: "Medium" },
  { name: "Imran K", age: 53, bloodGroup: "O-", requiredOrgan: "Kidney", urgency: "Critical" },
  { name: "Lavanya V", age: 37, bloodGroup: "A-", requiredOrgan: "Liver", urgency: "High" },
  { name: "Tarun P", age: 48, bloodGroup: "B-", requiredOrgan: "Kidney", urgency: "Medium" },
  { name: "Ankita G", age: 32, bloodGroup: "AB-", requiredOrgan: "Liver", urgency: "High" },
  { name: "Raghav T", age: 45, bloodGroup: "O+", requiredOrgan: "Kidney", urgency: "Low" },
  { name: "Pallavi N", age: 28, bloodGroup: "A+", requiredOrgan: "Liver", urgency: "High" },
  { name: "Deepak B", age: 40, bloodGroup: "B+", requiredOrgan: "Kidney", urgency: "Critical" },
  { name: "Mitali R", age: 30, bloodGroup: "AB+", requiredOrgan: "Liver", urgency: "Medium" },
];

async function seedDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Reset and seed fresh demo data for college presentation
    await Donor.deleteMany({});
    await Recipient.deleteMany({});

    await Donor.insertMany(donorData);
    await Recipient.insertMany(recipientData);

    console.log(`Seed complete: ${donorData.length} donors, ${recipientData.length} recipients`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
