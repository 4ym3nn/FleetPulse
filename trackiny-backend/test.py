import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000"  # Change to your Laravel API URL
LOGIN_EMAIL = "z@gmail.com"     # Change to your test user email
LOGIN_PASSWORD = "SuperSecure1"          # Change to your test user password

# Create a session to persist cookies
session = requests.Session()

def print_response(title, response):
    """Pretty print response details"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"\nHeaders:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")

    print(f"\nCookies:")
    for cookie in session.cookies:
        print(f"  {cookie.name}: {cookie.value[:50]}..." if len(cookie.value) > 50 else f"  {cookie.name}: {cookie.value}")

    print(f"\nResponse Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print(f"{'='*60}\n")

def test_sanctum_flow():
    """Test the complete Sanctum authentication flow"""

    # Step 1: Get CSRF Cookie
    print("\n🔹 STEP 1: Getting CSRF Cookie (User NOT authenticated yet)")
    try:
        csrf_response = session.get(f"{BASE_URL}/sanctum/csrf-cookie")
        print_response("GET /sanctum/csrf-cookie", csrf_response)

        if csrf_response.status_code == 204:
            print("✅ CSRF cookie obtained successfully")
            print("⚠️  User is still NOT authenticated - just has CSRF protection")
        else:
            print("❌ Failed to get CSRF cookie")
            return
    except Exception as e:
        print(f"❌ Error getting CSRF cookie: {e}")
        return

    # Step 2: Try to access protected route WITHOUT login (should fail)
    print("\n🔹 STEP 2: Trying to access /api/user WITHOUT login (should fail)")
    try:
        unauth_response = session.get(f"{BASE_URL}/api/user")
        print_response("GET /api/user (before login)", unauth_response)

        if unauth_response.status_code == 401:
            print("✅ Correctly denied - user not authenticated")
        else:
            print("⚠️  Unexpected response - should be 401")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Step 3: Login
    print("\n🔹 STEP 3: Logging in (authenticating user)")
    try:
        login_response = session.post(
            f"{BASE_URL}/api/login",
            json={
                "email": LOGIN_EMAIL,
                "password": LOGIN_PASSWORD
            },
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        )
        print_response("POST /login", login_response)

        if login_response.status_code == 201:
            print("✅ Login successful - user is NOW authenticated")
        else:
            print("❌ Login failed - check credentials")
            return
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return

    # Step 4: Access protected route AFTER login (should succeed)
    print("\n🔹 STEP 4: Accessing /api/user AFTER login (should succeed)")
    try:
        auth_response = session.get(
            f"{BASE_URL}/api/user",
            headers={"Accept": "application/json"}
        )
        print_response("GET /api/user (after login)", auth_response)

        if auth_response.status_code == 200:
            print("✅ Successfully accessed protected route - user is authenticated")
        else:
            print("❌ Failed to access protected route")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Step 5: Logout
    print("\n🔹 STEP 5: Logging out")
    try:
        logout_response = session.post(
            f"{BASE_URL}/logout",
            headers={"Accept": "application/json"}
        )
        print_response("POST /logout", logout_response)

        if logout_response.status_code == 204 or logout_response.status_code == 200:
            print("✅ Logout successful")
        else:
            print("⚠️  Unexpected logout response")
    except Exception as e:
        print(f"❌ Error during logout: {e}")

    # Step 6: Try to access protected route AFTER logout (should fail)
    print("\n🔹 STEP 6: Trying to access /api/user AFTER logout (should fail)")
    try:
        post_logout_response = session.get(f"{BASE_URL}/api/user")
        print_response("GET /api/user (after logout)", post_logout_response)

        if post_logout_response.status_code == 401:
            print("✅ Correctly denied - user logged out")
        else:
            print("⚠️  Unexpected response - should be 401")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Sanctum Authentication Test")
    print(f"📍 Testing against: {BASE_URL}")
    print(f"👤 Using credentials: {LOGIN_EMAIL}")

    test_sanctum_flow()

    print("\n" + "="*60)
    print("✨ Test Complete!")
    print("="*60)
