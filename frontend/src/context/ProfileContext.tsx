type profileProps = {
    colorID: number;
    children: any;
}

const profileColors: Record<number, string> = {
    1: 'linear-gradient(to top,#09b6c8,#f244f8)',
    2: 'linear-gradient(to top,#ff9d05,#8110d9)',
    3: 'linear-gradient(to top,#7109d1,#c83d64)',
    4: 'linear-gradient(to top,#ad7fde,#27e8aa)',
};

export default function ProfileContext(props: profileProps) {

    const background = () => profileColors[props.colorID] || profileColors[1]

    return (
        <div class='flex h-8 w-8 items-center justify-center rounded-full font-bold text-white' style={{background: background()}}>
            {props.children}
        </div>
    );
}
