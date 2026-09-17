CREATE TYPE "public"."muscle_group" AS ENUM('BACK', 'LEGS', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'CHEST', 'CARDIO');--> statement-breakpoint
CREATE TYPE "public"."workout_session_category" AS ENUM('STRENGTH', 'CARDIO');--> statement-breakpoint
CREATE TABLE "workout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "workout_session_category" NOT NULL,
	"performed_on" date DEFAULT CURRENT_DATE NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "session_id" uuid;--> statement-breakpoint
ALTER TABLE "workouts" ADD COLUMN "muscle_group" "muscle_group";--> statement-breakpoint
ALTER TABLE "workout_sessions" ADD CONSTRAINT "workout_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workout_sessions_user_date_idx" ON "workout_sessions" USING btree ("user_id","performed_on");--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_session_id_workout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workouts_session_idx" ON "workouts" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "workouts_user_group_idx" ON "workouts" USING btree ("user_id","muscle_group");