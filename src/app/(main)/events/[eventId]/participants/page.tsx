import ParticipantsList from '@/components/dashboard/user/ParticipantsList';

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Manage Participants
      </h1>
      <ParticipantsList eventId={eventId} />
    </div>
  );
}