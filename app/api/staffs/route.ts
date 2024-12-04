import { ORGANIZATION_ID } from '@/constants';
import { clerkClient, auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    await auth.protect();

    const [client, currentUser] = await Promise.all([
      await clerkClient(),
      await auth(),
    ]);

    if (!currentUser.orgRole?.includes('org:admin')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, username, password, firstName, lastName, role, position } =
      await req.json();

    if (!email || !password || !firstName || !lastName || !role || !position) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // create user with Clerk
    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      publicMetadata: {
        position: position,
      },
    });

    const organization =
      await client.organizations.createOrganizationMembership({
        organizationId: ORGANIZATION_ID!,
        userId: user.id,
        role: role,
      });

    if (organization && user) {
      return Response.json(
        { message: 'Staff member created successfully' },
        { status: 200 }
      );
    }

    return Response.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error && 'errors' in error) {
      const clerkError = error as {
        errors: { code: string; message: string }[];
      };
      return Response.json(
        {
          error: clerkError.errors[0].message,
          code: clerkError.errors[0].code,
        },
        { status: 422 }
      );
    }

    return Response.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
