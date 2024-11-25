import { Input } from '../../generic/Input';

interface CountdownProps {
    minValue: number;
    secValue: number;
    setMinValue: (value: number) => void;
    setSecValue: (value: number) => void;
}

const Countdown = ({ minValue, secValue, setMinValue, setSecValue }: CountdownProps) => {
    // Display timer settings inputs
    return (
        <div>
            <div className="mt-8 flex flex-row justify-center items-center">
                <Input
                    label="Min"
                    value={minValue}
                    onChange={setMinValue}
                    placeholder="#"
                />
                <Input
                    label="Sec"
                    value={secValue}
                    onChange={setSecValue}
                    placeholder="#"
                />
            </div>
        </div>
    );
};

export default Countdown;
