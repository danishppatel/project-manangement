import ClientPage from '@/components/templates/ClientPage';

interface Props {
    params: Promise<{
        id: string; uid: string 
}>
}
export default async function ProjectPage({ params }: Props) {
    const id = await params
    return <ClientPage projectId={id.id} />;
}
