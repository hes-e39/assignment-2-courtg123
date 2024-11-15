import styled from "styled-components";

import DocumentComponent from "../components/documentation/DocumentComponent";

import Loading from "../components/generic/Loading";
import { Button, PlayPauseButton, FastForwardButton, ResetButton } from  "../components/generic/Button";
import { DisplayRounds } from "../components/generic/DisplayRounds";
import { DisplayTime } from "../components/generic/DisplayTime";
import { Input } from "../components/generic/Input";
import { Panel } from "../components/generic/Panel";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2rem;
`;

/**
 * You can document your components by using the DocumentComponent component
 */
const Documentation = () => {
  return (
    <Container>
      <div>
        <Title>Documentation</Title>
        <DocumentComponent
          title="Loading spinner "
          component={<Loading size="medium" color="#ffa2bf" />}
          propDocs={[
            {
              prop: "size",
              description: "Changes the size of the loading spinner",
              type: "string",
              defaultValue: "medium",
            },
          ]}
        />

        <DocumentComponent
          title="Button"
          component={
            <Button>
                Label
            </Button>
          }
          propDocs={[
            {
              prop: "children",
              description: "Changes the label of the button",
              type: "React.ReactNode",
              defaultValue: "null",
            },
            {
              prop: "onClick",
              description: "Function called when the button is clicked on",
              type: "() => void",
              defaultValue: "undefined",
            },
            {
              prop: "className",
              description: "Adds css classes to the button",
              type: "string",
              defaultValue: "''",
            },
          ]}
        />

        <DocumentComponent
          title="Button - Play/Pause"
          component={
            <PlayPauseButton />
          }
          propDocs={[
            {
              prop: "onClick",
              description: "Function called when the button is clicked on",
              type: "() => void",
              defaultValue: "undefined",
            },
          ]}
        />

        <DocumentComponent
          title="Button - Fast Forward"
          component={
            <FastForwardButton />
          }
          propDocs={[
            {
              prop: "onClick",
              description: "Function called when the button is clicked on",
              type: "() => void",
              defaultValue: "undefined",
            },
          ]}
        />

        <DocumentComponent
          title="Button - Reset"
          component={
            <ResetButton />
          }
          propDocs={[
            {
              prop: "onClick",
              description: "Function called when the button is clicked on",
              type: "() => void",
              defaultValue: "undefined",
            },
          ]}
        />

        <DocumentComponent
          title="Input"
          component={
            <Input
              label="Input"
              value={0}
              placeholder="#"
            />
          }
          propDocs={[
            {
              prop: "label",
              description: "Label for the input field",
              type: "string",
              defaultValue: "none (required)",
            },
            {
              prop: "value",
              description: "Current value of the input field",
              type: "number",
              defaultValue: "0",
            },
            {
              prop: "placeholder",
              description: "Placeholder text for the input field",
              type: "string",
              defaultValue: "''",
            },
            {
              prop: "className",
              description: "Adds css classes to the the button",
              type: "string",
              defaultValue: "''",
            },
            {
              prop: "min",
              description: "Minimum value of the field",
              type: "number",
              defaultValue: "undefined",
            },
            {
              prop: "max",
              description: "Maximum value of the field",
              type: "number",
              defaultValue: "undefined",
            },
            {
              prop: "step",
              description: "Increment step amount",
              type: "number",
              defaultValue: "undefined",
            },
            {
              prop: "onChange",
              description: "Function called when there is a change to the input value",
              type: "(value: number) => void",
              defaultValue: "undefined",
            },
            {
              prop: "disabled",
              description: "Sets input field to a disabled state",
              type: "boolean",
              defaultValue: "false",
            },
          ]}
        />

        <DocumentComponent
          title="Display Time"
          component={
            <DisplayTime
              timeInMs={999990}
            />
          }
          propDocs={[
            {
              prop: "timeInMs",
              description: "The time left on the timer in milliseconds",
              type: "number",
              defaultValue: "0",
            },
          ]}
        />

        <DocumentComponent
          title="Display Rounds"
          component={
            <DisplayRounds
              currentRound={1}
              totalRounds={5}
              phase="Work"
            />
          }
          propDocs={[
            {
              prop: "currentRound",
              description: "The current round number",
              type: "number",
              defaultValue: "none (required)",
            },
            {
              prop: "totalRounds",
              description: "The total number of rounds",
              type: "number",
              defaultValue: "none (required)",
            },
            {
              prop: "phase",
              description: "The current round number",
              type: "'Work' | 'Rest' | undefined",
              defaultValue: "undefined",
            },
          ]}
        />

        <DocumentComponent
          title="Panel"
          component={
            <Panel
              title="Title"
            >
              Content
            </Panel>
          }
          propDocs={[
            {
              prop: "title",
              description: "The panel title",
              type: "string",
              defaultValue: "none (required)",
            },
            {
              prop: "children",
              description: "The panel content",
              type: "React.ReactNode",
              defaultValue: "none (required)",
            },
          ]}
        />

      </div>
    </Container>
  );
};

export default Documentation;
