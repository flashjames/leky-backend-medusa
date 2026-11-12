import { model } from "@medusajs/framework/utils";

const OnboardingState = model.define("onboarding_state", {
  id: model.id({ prefix: "onb_" }).primaryKey(),
  current_step: model.text().nullable(),
  is_complete: model.boolean().default(false),
  product_id: model.text().nullable(),
});

export default OnboardingState;