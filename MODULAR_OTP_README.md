# 📱 Modular OTP Verification System

## 🏗️ Architecture Overview

The OTP verification system has been refactored into a modular, server-action based architecture for better maintainability, security, and scalability.

### 📁 File Structure

```
lib/
├── actions/
│   ├── phone-verification.js    # Server action for phone verification
│   └── otp-actions.js          # Server actions for OTP operations
├── services/
│   └── sms-service.js          # SMS service integration layer
└── utils/
    └── phone-utils.js          # Phone number utility functions

hooks/
└── useOtpVerification.js       # Custom React hook for OTP flow

components/voter/
└── otp-verification.jsx        # Clean UI component
```

## 🔧 Components Breakdown

### 1. Server Actions (`lib/actions/`)

**`phone-verification.js`**
- ✅ Verifies entered phone against registered phone in database
- ✅ Secure server-side validation
- ✅ Proper error handling

**`otp-actions.js`**
- ✅ Send OTP to voter's phone
- ✅ Verify OTP code
- ✅ Integrates with SMS service layer

### 2. SMS Service (`lib/services/sms-service.js`)

**Features:**
- ✅ Modular SMS integration layer
- ✅ In-memory OTP storage (use Redis in production)
- ✅ OTP expiration (5 minutes)
- ✅ Attempt limiting (max 3 attempts)
- ✅ Automatic cleanup of expired OTPs

**Integration Ready For:**
- 🔌 Twilio
- 🔌 AWS SNS
- 🔌 Firebase SMS
- 🔌 Local SMS Gateway

### 3. Utilities (`lib/utils/phone-utils.js`)

**Functions:**
- `maskPhoneNumber()` - Mask phone for display
- `isValidPhoneNumber()` - Validate phone format
- `formatPhoneNumber()` - Format for display
- `cleanPhoneNumber()` - Remove non-digits

### 4. Custom Hook (`hooks/useOtpVerification.js`)

**State Management:**
- ✅ All OTP flow state
- ✅ Loading states
- ✅ Error handling
- ✅ Action handlers

### 5. UI Component (`components/voter/otp-verification.jsx`)

**Clean Separation:**
- ✅ Pure UI component
- ✅ No business logic
- ✅ Uses custom hook
- ✅ Server actions integration

## 🚀 Usage

### Basic Implementation

```jsx
import { OtpVerification } from "@/components/voter/otp-verification";

function VoterPage() {
  return (
    <OtpVerification
      voterId="V001"
      voterData={voterData}
      onVerified={() => console.log("OTP verified!")}
    />
  );
}
```

### Custom Hook Usage

```jsx
import { useOtpVerification } from "@/hooks/useOtpVerification";

function CustomOtpComponent({ voterId }) {
  const {
    enteredPhone,
    otp,
    isPhoneVerified,
    isOtpSent,
    isVerified,
    isLoading,
    handleVerifyPhone,
    handleSendOtp,
    handleVerifyOtp,
  } = useOtpVerification(voterId);

  // Your custom UI implementation
}
```

## 🔌 SMS Service Integration

### 1. Twilio Integration

```javascript
// In lib/services/sms-service.js
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function sendSmsOtp(phoneNumber) {
  const otp = generateOtp();
  
  await client.messages.create({
    body: `Your OTP is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: phoneNumber
  });
  
  // Store OTP...
}
```

### 2. AWS SNS Integration

```javascript
// In lib/services/sms-service.js
import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export async function sendSmsOtp(phoneNumber) {
  const otp = generateOtp();
  
  await sns.publish({
    Message: `Your OTP is: ${otp}. Valid for 5 minutes.`,
    PhoneNumber: phoneNumber
  }).promise();
  
  // Store OTP...
}
```

### 3. Local SMS Gateway

```javascript
// In lib/services/sms-service.js
export async function sendSmsOtp(phoneNumber) {
  const otp = generateOtp();
  
  await fetch('http://your-sms-gateway.com/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: phoneNumber,
      message: `Your OTP is: ${otp}. Valid for 5 minutes.`
    })
  });
  
  // Store OTP...
}
```

## 🔒 Security Features

### OTP Security
- ✅ 4-digit random OTP generation
- ✅ 5-minute expiration
- ✅ Maximum 3 attempts per OTP
- ✅ Automatic cleanup of expired OTPs
- ✅ Server-side validation only

### Phone Verification
- ✅ Database validation against registered phone
- ✅ Masked phone display for privacy
- ✅ Server-side phone matching

### Data Protection
- ✅ No sensitive data in client state
- ✅ Server actions for all operations
- ✅ Proper error handling without data leaks

## 📊 Production Considerations

### 1. OTP Storage
Replace in-memory storage with Redis:

```javascript
// lib/services/redis-otp-storage.js
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function storeOtp(phoneNumber, otp, expirationSeconds = 300) {
  await redis.setex(`otp:${phoneNumber}`, expirationSeconds, JSON.stringify({
    otp,
    attempts: 0,
    createdAt: Date.now()
  }));
}
```

### 2. Rate Limiting
Add rate limiting for OTP requests:

```javascript
// lib/middleware/rate-limit.js
export async function rateLimitOtp(phoneNumber) {
  const key = `otp_rate:${phoneNumber}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  
  if (count > 5) { // Max 5 OTPs per hour
    throw new Error('Rate limit exceeded');
  }
}
```

### 3. Logging & Monitoring
Add comprehensive logging:

```javascript
// lib/utils/logger.js
export function logOtpEvent(event, phoneNumber, metadata = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    phoneNumber: maskPhoneNumber(phoneNumber),
    ...metadata
  }));
}
```

## 🧪 Testing

### Unit Tests
```javascript
// __tests__/otp-service.test.js
import { sendSmsOtp, verifySmsOtp } from '@/lib/services/sms-service';

describe('OTP Service', () => {
  test('should generate and verify OTP', async () => {
    const result = await sendSmsOtp('+1234567890');
    expect(result.success).toBe(true);
    
    // Test verification with correct OTP
    const verification = await verifySmsOtp('+1234567890', '1234');
    expect(verification.success).toBe(true);
  });
});
```

### Integration Tests
```javascript
// __tests__/otp-actions.test.js
import { sendOtpToVoter, verifyOtpForVoter } from '@/lib/actions/otp-actions';

describe('OTP Actions', () => {
  test('should send OTP to registered voter', async () => {
    const result = await sendOtpToVoter('V001');
    expect(result.success).toBe(true);
    expect(result.maskedPhone).toMatch(/\d{3}\*+\d{3}/);
  });
});
```

## 🔄 Migration Guide

### From Old System
1. Replace direct SMS calls with server actions
2. Move business logic to custom hooks
3. Update components to use new architecture
4. Configure SMS service integration
5. Test thoroughly in development

### Environment Variables
```env
# SMS Service Configuration
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
TWILIO_PHONE=+1234567890

# Or AWS SNS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Redis (Production)
REDIS_URL=redis://localhost:6379
```

This modular architecture provides better separation of concerns, improved security, and easier maintenance while being ready for production deployment with proper SMS service integration.