import FlashCard from "./FlashCard"


const cardsData = [
    {
        title   : "Central Processing Unit",
        content : `![alt text](cpu_icon.png "Title")

The brains of the computer`,
        alternateContent: `
The Central Processing Unit (CPU) is often referred to as the "brains of the computer," and for good reason. It is the primary component responsible for interpreting and executing most of the commands from the computer's hardware and software. The CPU performs the essential arithmetic, logic, control, and input/output (I/O) operations specified by the instructions in the programs. Essentially, it processes the data needed to perform tasks, from simple calculations to complex algorithms, making it a crucial element in the overall functionality of a computer system.


However, while the CPU is indispensable, calling it the sole "brains of the computer" might be a bit of an oversimplification. Modern computers rely on a variety of specialized processors and components that work in conjunction with the CPU. For example, the Graphics Processing Unit (GPU) handles complex image rendering tasks, and the memory (RAM) manages short-term data storage for quick access. Additionally, storage drives (like SSDs and HDDs) are vital for long-term data retention. Together, these components form a highly integrated system where the CPU plays a central, but not exclusive, role in ensuring the computer operates efficiently.`,
    },
    {
        title   : "Motherboard",
        content : `![alt text](motherboard_icon.png "Title")

The nervous system of the computer`,
        alternateContent: "The motherboard is the main circuit board in a computer that houses the CPU, memory, and other essential components. It acts as a central hub where various parts of the computer communicate with each other. All peripheral devices, storage systems, and expansion cards connect to the motherboard, enabling them to exchange data seamlessly. Just as the central nervous system in the human body coordinates activities between different organs and systems, the motherboard ensures that all components of the computer work together harmoniously. Without a functioning motherboard, a computer cannot operate, much like how the nervous system is crucial for bodily functions.",
    },
    {
        title   : "Memory",
        content : `![alt text](ram_icon.png "Title")

Short-Term Storage`,
        alternateContent: "RAM  (Random Access Memory) is a type of volatile memory that stores data temporarily while the computer is running. It allows the CPU to quickly access and process information needed for current tasks. RAM is akin to the brain's short-term memory, which holds information that is immediately relevant but not stored permanently. When you open a program or file, it is loaded into RAM to ensure quick access. Once the computer is turned off or the task is completed, this data is erased. The speed and capacity of RAM directly affect a computer’s performance and multitasking capabilities, just as short-term memory efficiency impacts how quickly and effectively we can process and use information in our daily activities.",
    },
    {
        title   : "Hard Disk Drive",
        content : `![alt text](hdd_icon.png "Title")

Long-Term Memories`,
        alternateContent: "Storage devices, such as Hard Disk Drives (HDDs) and Solid State Drives (SSDs), serve as the computer’s long-term memory. Unlike RAM, these storage solutions retain data even when the computer is turned off. HDDs use spinning disks to read and write data, while SSDs use flash memory, offering faster data access speeds. These storage devices are where the operating system, applications, and user data are stored permanently. This is similar to the brain’s long-term memory, which holds information over extended periods, allowing us to recall past experiences, knowledge, and skills. The efficiency and reliability of these storage devices are crucial for data retrieval and overall system performance, much like how the effectiveness of long-term memory is vital for retaining and recalling information throughout our lives.",
    }
]


const FlashCardsExample: React.FC = () => {
    return (
        <div>
            <div className="cards-container">
                {cardsData.map( ( card, index ) => (
                    <FlashCard
                        key={index}
                        title={card.title}
                        content={card.content}
                        alternateContent={card.alternateContent}
                    />
                ) )}
            </div>
        </div>
    )
}

export default FlashCardsExample