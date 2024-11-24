import { Input } from '../../generic/Input';

interface TabataSettingsProps {
    workMinValue: number;
    workSecValue: number;
    restMinValue: number;
    restSecValue: number;
    roundsValue: number;
    setWorkMinValue: (value: number) => void;
    setWorkSecValue: (value: number) => void;
    setRestMinValue: (value: number) => void;
    setRestSecValue: (value: number) => void;
    setRoundsValue: (value: number) => void;
}

const TabataSettings = ({ workMinValue, workSecValue, restMinValue, restSecValue, roundsValue, setWorkMinValue, setWorkSecValue, setRestMinValue, setRestSecValue, setRoundsValue }: TabataSettingsProps) => {

    // display timer
    return (
        <div>
            <div className="mt-8 flex flex-row justify-center items-center space-x-8">
                <div className="mb-6">
                    <p className="font-bold mb-2">Work</p>
                    <div className="flex flex-row justify-center items-center">
                        <Input
                            label="Min"
                            value={workMinValue}
                            onChange={setWorkMinValue}
                            placeholder="#"
                        />
                        <Input
                            label="Sec"
                            value={workSecValue}
                            onChange={setWorkSecValue}
                            placeholder="#"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <p className="font-bold mb-2">Rest</p>
                    <div className="flex flex-row justify-center items-center">
                        <Input
                            label="Min"
                            value={restMinValue}
                            onChange={setRestMinValue}
                            placeholder="#" 
                        />
                        <Input
                            label="Sec"
                            value={restSecValue}
                            onChange={setRestSecValue}
                            placeholder="#"
                        />
                    </div>
                </div>
            </div>
                <Input
                    label="Rounds"
                    value={roundsValue}
                    onChange={setRoundsValue}
                    min={1}
                    placeholder="#"
                />
            
        </div>
    );
};

export default TabataSettings;