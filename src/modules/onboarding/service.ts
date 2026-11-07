import { MedusaService } from "@medusajs/framework/utils";
import OnboardingState from "./models/onboarding";

class OnboardingModuleService extends MedusaService({
  OnboardingState,
}) {}

export default OnboardingModuleService;