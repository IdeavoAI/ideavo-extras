# Plans and billing

One plan page, in the place the user chose, that adapts to the user. It shows only the signed-in user's own data, read on the server.

- **Before paying:** one `Card` per plan, in a grid (one column on mobile, up to three on desktop): the name, the price and period in tabular numbers ("₹499 / month"), and what it adds over free, written as outcomes from the user's answers and never invented. At most three plans, one recommended with a `Badge`, one button each; a monthly/annual toggle and "Cancel anytime" only when true.
- **After paying:** the current plan, its price, the purchase or renewal date and a status `Badge` (a text label, not colour alone). For subscriptions, "Next charge on <date>", "Cancels on <date>", "Payment failed. Retrying automatically." or "Ended on <date>", with "Cancel plan" behind an `AlertDialog` that says when access ends. Below, the history, newest first: date, product, amount (right-aligned), method and status, for every purchase including one-time ones.

In the rest of the app:

- **Paid status** lives in existing UI, never a banner: the plan name next to the user's name in the account menu or sidebar, and paid features simply unlocked.
- **Entry point:** an account-menu or sidebar item leading to the plan page, "Upgrade" before paying and "Plan" after.
- **Usage,** if free limits exist: shown where the feature lives ("3 of 5 used"), with a quiet upgrade link as the limit nears; the paywall appears only at the limit.
- **After purchase:** a short confirmation of what's now unlocked, then back to where the user was.

Format amounts from the stored unit with `Intl.NumberFormat` and the currency, and dates for the user's locale. Guests have no plan page; their confirmation page is a centred `Card` with the product, amount, date and payment ID.
