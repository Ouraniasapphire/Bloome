import StudioCard from '~/components/StudioCard/StudioCard';

const Dashboard = () => {
    const testData = {
        id: '1234',
        name: 'Test class',
        description: 'Hello world',
        teacher_id: '5678',
        invite_code: '0',
        room: '204',
        hour: '1st',
    };

    // Array of cards to render
    const cards = Array(4).fill(testData);

    return (
        <div className='w-full h-full flex gap-4 flex-row flex-wrap justify-start items-stretch p-4 box-border'>
            {cards.map((card, index) => (
                <StudioCard
                    key={index}
                    id={card.id}
                    name={card.name}
                    description={card.description}
                    teacher_id={card.teacher_id}
                    invite_code={card.invite_code}
                    room={card.room}
                    hour={card.hour}
                />
            ))}
        </div>
    );
};

export default Dashboard;
