# Legacy Flask Backend

This folder contains the **original Flask backend** that was running before Phase B1.

It has been preserved here for reference — specifically the business logic routes
that will be ported to FastAPI in future phases:

| Route | Phase |
|-------|-------|
| `/signup`, `/login` | Phase B2 (Auth) |
| `/add_pet`, `/view_pets`, `/update_pet`, `/delete_pet` | Phase B3 (Pets) |
| `/book_appointment`, `/view_appointments`, `/cancel_appointment` | Phase B3 (Appointments) |
| `/add_product`, `/view_products` | Phase B4 (Shop) |
| `/add_to_cart`, `/view_cart`, `/update_cart`, `/remove_from_cart`, `/checkout` | Phase B4 (Shop) |
| `/place_order`, `/view_orders` | Phase B4 (Shop) |
| `/add_adoption` | Phase B5 (Community) |
| `/add_feedback` | Phase B5 (Community) |
| `/dashboard` | Phase B3+ |

**Do NOT import from this folder.** These files are read-only references.
