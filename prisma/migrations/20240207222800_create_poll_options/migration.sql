-- CreateTable
CREATE TABLE "poll_option" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,

    CONSTRAINT "poll_option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
