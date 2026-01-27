🧪 SIMPLE TEST - Direct API Testing

═══════════════════════════════════════════════════════════════

To test the API directly without the UI, follow these steps:

═══════════════════════════════════════════════════════════════

TEST 1: Test Load Endpoint (without browser UI)
─────────────────────────────────────────────────

Open a new browser tab and navigate to:
http://localhost/ccis_connect/admin/manage/load_homepage

Expected result:
You should see JSON response like:
{
  "success": false,
  "message": "No homepage data found"
}

(It's "no data found" because we haven't saved anything yet)

═══════════════════════════════════════════════════════════════

TEST 2: Test with cURL (Windows PowerShell)
─────────────────────────────────────────────

Open PowerShell and run:

curl.exe -X GET http://localhost/ccis_connect/admin/manage/load_homepage

Expected output:
{"success":false,"message":"No homepage data found"}

═══════════════════════════════════════════════════════════════

TEST 3: Manual Database Insert
────────────────────────────────

If you want to test reading saved data, insert test data:

1. Open phpMyAdmin
2. Go to your database
3. Go to homepage table
4. Click "Insert" button
5. Fill in:
   • title: "Test Homepage"
   • content: "Test content here"
   • banner_image: (leave NULL)
6. Click "Go"

Then test the load endpoint again:
http://localhost/ccis_connect/admin/manage/load_homepage

Now you should see:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Test Homepage",
    "content": "Test content here",
    "banner_image": null,
    "created_at": "...",
    "updated_at": "..."
  }
}

═══════════════════════════════════════════════════════════════

TEST 4: Test from Browser Console
──────────────────────────────────

1. Navigate to: http://localhost/ccis_connect/admin/content/homepage
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Paste this code:

$.ajax({
    url: 'http://localhost/ccis_connect/admin/manage/load_homepage',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        console.log('Load Response:', response);
    },
    error: function(xhr, status, error) {
        console.log('Error:', error);
        console.log('Response:', xhr.responseText);
    }
});

5. Press Enter
6. Look in console for the response

═══════════════════════════════════════════════════════════════

If all these tests work, then the issue is likely in:
1. Browser caching
2. JavaScript file not loading
3. Modal library (Bootstrap)

═══════════════════════════════════════════════════════════════
