// Simple API Test
import { GitHubAPI, AuthAPI, RateLimitAPI, analyzeRepository } from './services/api.js';

// Test basic API functionality
async function testAPI() {
  console.log('🧪 Testing GitHub Repository Analyzer API Integration...\n');

  // Test 1: Rate Limit Check
  console.log('1. Testing Rate Limit API...');
  try {
    const rateLimit = await RateLimitAPI.getRateLimit();
    if (rateLimit) {
      console.log(`✅ Rate Limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit} remaining`);
    } else {
      console.log('❌ Rate limit check failed');
    }
  } catch (error) {
    console.log('❌ Rate limit error:', error.message);
  }

  // Test 2: Check Auth Status
  console.log('\n2. Testing Authentication...');
  const hasToken = AuthAPI.hasToken();
  console.log(`${hasToken ? '✅' : '⚠️'} GitHub Token: ${hasToken ? 'Configured' : 'Not configured'}`);

  // Test 3: Repository Analysis (using a well-known public repo)
  console.log('\n3. Testing Repository Analysis...');
  try {
    const testRepo = 'https://github.com/facebook/react';
    console.log(`Analyzing: ${testRepo}`);

    const startTime = Date.now();
    const result = await analyzeRepository(testRepo);
    const endTime = Date.now();

    console.log('✅ Analysis completed successfully!');
    console.log(`📊 Repository: ${result.repository.full_name}`);
    console.log(`⭐ Stars: ${result.repository.stargazers_count}`);
    console.log(`🍴 Forks: ${result.repository.forks_count}`);
    console.log(`👥 Contributors: ${result.contributors.length}`);
    console.log(`📝 Languages: ${Object.keys(result.languages).length}`);
    console.log(`🔒 Security Score: ${result.securityScore}%`);
    console.log(`⏱️ Analysis time: ${endTime - startTime}ms`);

  } catch (error) {
    console.log('❌ Analysis failed:', error.message);

    if (error.response?.status === 403) {
      console.log('💡 Tip: Add a GitHub token to increase rate limits');
    }
  }

  console.log('\n🎉 API Integration Test Complete!');
}

// Export for use in browser console
window.testAPI = testAPI;

// Auto-run in development
if (import.meta.env.MODE === 'development') {
  console.log('GitHub Repository Analyzer - API Test Available');
  console.log('Run testAPI() in console to test the integration');
}

export default testAPI;
