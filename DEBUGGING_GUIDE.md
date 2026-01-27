🧪 DEBUGGING GUIDE - Homepage Management Issue

═══════════════════════════════════════════════════════════════

STEP 1: CLEAR BROWSER CACHE
─────────────────────────────
1. Press Ctrl + Shift + Delete
2. Clear all cache and cookies
3. Close and reopen browser

STEP 2: OPEN DEVELOPER CONSOLE
───────────────────────────────
1. Navigate to: http://localhost/ccis_connect/admin/content/homepage
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. You should see: "🏠 Manage Homepage Loading..."
5. You should see: "Base URL: http://localhost/ccis_connect/"

STEP 3: FILL THE FORM
──────────────────────
1. Title: "Test Homepage"
2. Content: "This is test content"
3. Image: (optional, skip for now)

STEP 4: SUBMIT FORM
────────────────────
1. Click "Save Changes"
2. Watch the Console tab in F12
3. Look for these messages in order:

   Expected console output:
   ✓ "Submitting form to: http://localhost/ccis_connect/admin/manage/save_homepage"
   ✓ "Form data - Title: Test Homepage Content: This is test content File: No"
   ✓ "✅ Response received: {success: true, ...}"
   ✓ "✅ Save successful!"
   ✓ GREEN MODAL should appear

STEP 5: CHECK NETWORK TAB
─────────────────────────
1. Go to Network tab (next to Console)
2. Refresh page (F5)
3. Fill form and submit again
4. Look for POST request to: /admin/manage/save_homepage
5. Click on that request
6. Go to "Response" tab
7. You should see JSON: {"success": true, "message": "...", ...}

═══════════════════════════════════════════════════════════════

WHAT TO LOOK FOR
──────────────────

If form doesn't submit:
❌ Check Console for JavaScript errors
❌ Check Network tab - is POST request being sent?
❌ Check if /admin/manage/save_homepage responds

If modal doesn't show:
❌ Check Console for "Showing modal:" message
❌ Check if bootstrap.Modal is defined
❌ Try clicking anywhere - modal might be hidden

If data doesn't save:
❌ Check Network response - is success=true?
❌ Check database - homepage table empty?
❌ Check server error log

═══════════════════════════════════════════════════════════════

COMMON ISSUES & FIXES
──────────────────────

Issue 1: "404 Not Found" error
→ Check routes.php has these lines:
  $route['admin/manage/load_homepage'] = 'admin/AdminContent/load_homepage';
  $route['admin/manage/save_homepage'] = 'admin/AdminContent/save_homepage';

Issue 2: "bootstrap is not defined"
→ Ensure Bootstrap 5.3 is loaded in header
→ Check developer tools console for loading errors

Issue 3: Data not in database
→ Check homepage table exists
→ Run in phpMyAdmin: SELECT * FROM homepage;
→ Check server error log: application/logs/

Issue 4: Modal doesn't appear
→ Check Console for "Showing modal:" message
→ Check if modal div is added to DOM (Inspector)
→ Try pressing Escape key - modal might be there but hidden

═══════════════════════════════════════════════════════════════

QUICK TEST CHECKLIST
─────────────────────

□ Page loads (no JavaScript errors in console)
□ Console shows "🏠 Manage Homepage Loading..."
□ Console shows "Base URL: http://localhost/ccis_connect/"
□ Form is visible with 3 fields
□ "Save Changes" button is clickable
□ Fill form with test data
□ Submit form
□ Console shows "Submitting form to: ..."
□ Network tab shows POST request
□ Network response shows success:true
□ Green modal appears on screen
□ Modal closes automatically after 5 seconds
□ Database has new row in homepage table

═══════════════════════════════════════════════════════════════

If you see errors, copy the console output and include it in
your question for faster diagnosis.

═══════════════════════════════════════════════════════════════
