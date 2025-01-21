import ProjectDetailPage from '@/components/templates/ProjectDetailPage';

interface Props {
    params: Promise<{
        id: string; uid: string 
}>
}
export default async function ProjectPage({ params }: Props) {
    const id = await params
    return <ProjectDetailPage projectId={id.id} />;
}
