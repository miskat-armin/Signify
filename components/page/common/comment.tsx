import { comment } from "@/constants/type";
import { Avatar, Card, Text } from "react-native-paper";

export default function CommentCard({ comment }: { comment: comment }) {
  return (
    <Card>
      <Card.Title
        title={comment.user.username}
        left={() => (
          <Avatar.Image size={24} source={{ uri: comment.user.avatar }} />
        )}
      />
      <Card.Content>
        <Text variant="labelSmall">{comment.comment}</Text>
      </Card.Content>
    </Card>
  );
}
