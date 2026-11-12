import OnboardingModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const ONBOARDING_MODULE = "onboarding";

export default Module(ONBOARDING_MODULE, {
  service: OnboardingModuleService,
});