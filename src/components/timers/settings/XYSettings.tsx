import { Input } from '../../generic/Input';

interface XYSettingsProps {
    minValue: number;
    secValue: number;
    roundsValue: number;
    setMinValue: (value: number) => void;
    setSecValue: (value: number) => void;
    setRoundsValue: (value: number) => void;
}

const XYSettings = ({ minValue, secValue, roundsValue, setMinValue, setSecValue, setRoundsValue }: XYSettingsProps) => {

    // display timer
    return (
        <div>
            <div className="mt-8">
                    <p className="font-bold mb-2">Time</p>
            </div>
            <div className="flex flex-row justify-center items-center mb-6">
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
            <Input
                label="Rounds"
                value={roundsValue}
                onChange={setRoundsValue}
                min={0}
                placeholder="#"
            />

        </div>
    );
};

export default XYSettings;

