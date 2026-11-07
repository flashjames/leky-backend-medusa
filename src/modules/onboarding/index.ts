import OnboardingModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const ONBOARDING_MODULE = "onbarding";

export default Module(ONBOARDING_MODULE, {
  service: OnboardingModuleService,
});