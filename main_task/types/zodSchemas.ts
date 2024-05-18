// zodSchemas.ts
import { z } from "zod";

export const INewLicenseSchema = z.object({
  CompanyName: z.string(),
  LicenceType: z.string(),
  IsOffice: z.boolean(),
  OfficeName: z.string(),
  OfficeServiceNumber: z.string(),
  RequestDate: z.string(),
  Activities: z.string(),
});

export const IAccountRequestSchema = z.object({
  CompanyName: z.string(),
  RequesterName: z.string(),
  ApplicantName: z.string(),
  UserName: z.string(),
  ContactEmail: z.string(),
  Permissions: z.array(z.string()),
});

export const IInspectionRequestSchema = z.object({
  CompanyName: z.string(),
  InspectionDate: z.string(),
  InspectionTime: z.string(),
  InspectionType: z.string(),
});

export const IAddNewActivitySchema = z.object({
  CompanyName: z.string(),
  LicenceID: z.string(),
  Activities: z.array(z.string()),
});

export const IStampLicenseLetterSchema = z.object({
  CompanyName: z.string(),
  LicenceID: z.string(),
  RequestDate: z.string(),
});

export default {
  INewLicenseSchema,
  IAccountRequestSchema,
  IInspectionRequestSchema,
  IAddNewActivitySchema,
  IStampLicenseLetterSchema,
};
