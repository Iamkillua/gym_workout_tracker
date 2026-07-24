CREATE TABLE "daily_activity_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recorded_on" date DEFAULT CURRENT_DATE NOT NULL,
	"steps" integer DEFAULT 0 NOT NULL,
	"activity_calories" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_activity_entries" ADD CONSTRAINT "daily_activity_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_activity_entries_user_date_idx" ON "daily_activity_entries" USING btree ("user_id","recorded_on");