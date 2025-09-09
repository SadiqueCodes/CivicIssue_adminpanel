import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client (Claude)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'demo-key',
});

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // If no API key, return mock response
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo-key') {
      return NextResponse.json({
        response: generateMockResponse(message),
        suggested_actions: generateMockActions(message),
        context_updates: {},
      });
    }

    // Call Claude API
    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are an AI assistant for a civic issue management system. 
          Context: ${JSON.stringify(context)}
          User message: ${message}
          
          Provide helpful insights and suggest actionable recommendations.`,
        },
      ],
    });

    const response = completion.content[0].text;
    const actions = extractActions(response);

    return NextResponse.json({
      response,
      suggested_actions: actions,
      context_updates: {},
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Return mock response on error
    return NextResponse.json({
      response: "I'm analyzing the current situation. Based on the data, there are several critical issues that need immediate attention in the Downtown District.",
      suggested_actions: [
        { type: 'view', label: 'View Critical Issues', target: '/dashboard/issues?priority=high' },
      ],
      context_updates: {},
    });
  }
}

function generateMockResponse(message: string): string {
  const responses: { [key: string]: string } = {
    'critical': "I've identified 3 critical issues that require immediate attention. The pothole on Main Street has the highest severity score at 9.2/10 and has been reported by multiple citizens.",
    'resource': "Current resource allocation shows Team A at 80% capacity, Team B at 60%, and Team C at 40%. I recommend redistributing tasks from Team A to Team C for optimal efficiency.",
    'pattern': "Analysis shows a 35% increase in road-related issues this week, concentrated in Downtown and West Side districts. This correlates with recent heavy rainfall.",
    'performance': "Department performance metrics: Average resolution time is 4.2 hours (15% improvement from last month). Team A has the best performance with 89% on-time resolution rate.",
    'default': "Based on current data, the system is handling 1,284 active issues with 47 resolved today. The priority queue shows 23 critical issues requiring immediate attention.",
  };

  const key = Object.keys(responses).find(k => message.toLowerCase().includes(k)) || 'default';
  return responses[key];
}

function generateMockActions(message: string): any[] {
  if (message.toLowerCase().includes('critical')) {
    return [
      { type: 'filter', label: 'Show Critical Issues', filter: { priority: 'high' } },
      { type: 'assign', label: 'Auto-Assign Teams', action: 'auto_assign' },
    ];
  }
  
  if (message.toLowerCase().includes('resource')) {
    return [
      { type: 'view', label: 'View Team Dashboard', target: '/dashboard/teams' },
      { type: 'optimize', label: 'Optimize Allocation', action: 'optimize_resources' },
    ];
  }

  return [
    { type: 'view', label: 'View Dashboard', target: '/dashboard' },
  ];
}

function extractActions(response: string): any[] {
  // Extract potential actions from AI response
  const actions = [];
  
  if (response.includes('assign') || response.includes('dispatch')) {
    actions.push({ type: 'assign', label: 'Assign Team', action: 'show_assignment' });
  }
  
  if (response.includes('priority') || response.includes('critical')) {
    actions.push({ type: 'prioritize', label: 'Update Priority', action: 'change_priority' });
  }
  
  return actions;
}