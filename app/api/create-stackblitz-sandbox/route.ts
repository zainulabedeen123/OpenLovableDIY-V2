import { NextResponse } from 'next/server';
import { StackBlitzProvider } from '@/lib/sandbox/providers/stackblitz-provider';

export async function POST(request: Request) {
  try {
    console.log('[create-stackblitz-sandbox] Creating StackBlitz sandbox...');

    const provider = new StackBlitzProvider();
    const sandboxInfo = await provider.createSandbox();
    const projectFiles = provider.getProjectFiles();

    console.log('[create-stackblitz-sandbox] Sandbox created:', sandboxInfo.sandboxId);

    return NextResponse.json({
      success: true,
      ...sandboxInfo,
      projectFiles
    });
  } catch (error: any) {
    console.error('[create-stackblitz-sandbox] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create StackBlitz sandbox'
      },
      { status: 500 }
    );
  }
}

