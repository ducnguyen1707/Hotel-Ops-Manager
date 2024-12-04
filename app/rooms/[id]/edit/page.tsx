import { db } from '@/db';
import { EditRoomForm } from '@/components/edit-room-form';
import { notFound } from 'next/navigation';

const EditRoomPage = async ({ params }: { params: { id: string } }) => {
  const room = await db.room.findUnique({
    where: {
      id: params.id,
      isDelete: false,
    },
    include: {
      type: true,
    },
  });

  if (!room) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8 lg:w-[900px]'>
      <EditRoomForm room={room} />
    </div>
  );
};

export default EditRoomPage;
