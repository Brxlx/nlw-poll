type Message = { poll_option_id: string, votes: number }
type Subscriber = (message: Message) => void;

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};

  public subscribe(poll_id: string, subscriber: Subscriber) {
    if (!this.channels[poll_id]) {
      this.channels[poll_id] = [];
    }

    this.channels[poll_id].push(subscriber);
  }

  public publish(poll_id: string, message: Message) {
    if (!this.channels[poll_id]) {
      return;
    }

    for (const subscriber of this.channels[poll_id]) {
      subscriber(message);
    }
  }
}

export const voting = new VotingPubSub();