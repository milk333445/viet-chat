CREATE TABLE IF NOT EXISTS "File" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL,
  "filename" varchar(128) NOT NULL,
  "parsed" boolean DEFAULT false,
  "parse_result" jsonb,
  "createdAt" timestamp DEFAULT NOW()
);
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "File" ADD CONSTRAINT "File_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
