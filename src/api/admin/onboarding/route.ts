import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const onboardingModule = req.scope.resolve("onboarding");

  const [status] = await onboardingModule.listOnboardingStates(
    {},
    { take: 1 }
  );

  res.status(200).json({ status });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const onboardingModule = req.scope.resolve("onboarding");

  const [existing] = await onboardingModule.listOnboardingStates(
    {},
    { take: 1 }
  );

  const [status] = await onboardingModule.updateOnboardingStates({
    selector: { id: existing.id },
    data: req.body as Record<string, unknown>,
  });

  res.status(200).json({ status });
}