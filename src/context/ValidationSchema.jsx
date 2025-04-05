import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces") 
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"), 
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string() 
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"), 
});
