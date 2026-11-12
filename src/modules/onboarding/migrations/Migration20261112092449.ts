import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261112092449 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "onboarding_state" ("id" text not null, "current_step" text null, "is_complete" boolean not null default false, "product_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "onboarding_state_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_onboarding_state_deleted_at" ON "onboarding_state" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "onboarding_state" cascade;`);
  }

}
